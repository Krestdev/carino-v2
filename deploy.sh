EOF
set -euo pipefail

DEPLOY_DIR=~/deployments/wintercode-ui/current

if [ ! -d $DEPLOY_DIR ]; then
  mkdir -p $DEPLOY_DIR
  git clone https://github.com/${{ github.repository }} $DEPLOY_DIR
else
  cd $DEPLOY_DIR
  git pull origin main
fi

cd $DEPLOY_DIR

cp ~/deployments/wintercode-ui/shared/.env.prod .env.prod
export DOCKER_BUILDKIT=0

# Remove any containers that might conflict
docker rm -f wintercode-ui 2>/dev/null || true
docker rmi current-wintercode-ui:latest 2>/dev/null || true

# Build and run the new image
docker compose up -d --build

# Health check loop
for i in {1..10}; do
  if curl --fail http://localhost:3000/; then
    echo "✅ Health check passed"
    break
  fi
  echo "⏳ Waiting for app to be ready... ($i/10)"
  sleep 6
done

echo "🎯 Deployment complete"
exit 0
EOF