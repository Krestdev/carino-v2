// OrderPDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import { MyOrdersResponse, AddressData } from "@/types/types";
import { XAF } from "@/lib/functions";

// Enregistrer une police
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 11,
  },

  header: {
    textAlign: "center",
    marginBottom: 30,
    paddingBottom: 10,
    borderBottom: 1,
    borderBottomColor: "#e5e5e5",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    padding: 8,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
    width: "50%",
  },

  infoLabel: {
    width: "35%",
    fontWeight: "bold",
  },

  infoValue: {
    width: "65%",
  },

  table: {
    width: "100%",
    marginTop: 10,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottom: 1,
    borderBottomColor: "#ddd",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderBottom: 1,
    borderBottomColor: "#eee",
  },

  colProduct: {
    width: "40%",
  },

  colQuantity: {
    width: "20%",
    textAlign: "right",
  },

  colPrice: {
    width: "20%",
    textAlign: "right",
  },

  colTotal: {
    width: "20%",
    textAlign: "right",
  },

  totalRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderTopColor: "#ddd",
  },

  totalLabel: {
    width: "80%",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 12,
  },

  totalValue: {
    width: "20%",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 12,
  },

  statusContainer: {
    flexDirection: "row",
    gap: 10,
  },

  statusBox: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
  },

  statusLabel: {
    fontSize: 9,
    color: "#666",
    marginBottom: 4,
  },

  statusValue: {
    fontSize: 11,
    fontWeight: "bold",
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#999",
    borderTop: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 20,
  },
});

interface OrderPDFProps {
  order: MyOrdersResponse;
  deliveryAddress: AddressData | undefined;
  orderDate: string;
}

const OrderPDF = ({
  order,
  deliveryAddress,
  orderDate,
}: OrderPDFProps) => {
  const itemsWithTotal = order.items.map((item) => ({
    ...item,
    total: Number(item.price) * Number(item.quantity),
  }));

  const deliveryPrice = Number(deliveryAddress?.price || 0);

  const subTotal = Number(order.total) - deliveryPrice;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Détail de la commande
          </Text>

          <Text style={styles.subtitle}>
            Référence: Ref-{order.uuid}
          </Text>

          <Text style={styles.subtitle}>
            Date: {orderDate}
          </Text>
        </View>

        {/* Informations client */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Informations client
          </Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Référence:
              </Text>

              <Text style={styles.infoValue}>
                Ref-{order.uuid.slice(0, 12)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Client:
              </Text>

              <Text style={styles.infoValue}>
                {order.first_name}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Téléphone:
              </Text>

              <Text style={styles.infoValue}>
                {order.phone || "-"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Mode:
              </Text>

              <Text style={styles.infoValue}>
                {order.mode}
              </Text>
            </View>

            {deliveryAddress && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Ville:
                  </Text>

                  <Text style={styles.infoValue}>
                    {deliveryAddress.name}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Quartier:
                  </Text>

                  <Text style={styles.infoValue}>
                    {deliveryAddress.quartier}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>
                    Livraison:
                  </Text>

                  <Text style={styles.infoValue}>
                    {XAF.format(deliveryPrice)}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Articles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Articles commandés
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.colProduct}>
                Produit
              </Text>

              <Text style={styles.colQuantity}>
                Qté
              </Text>

              <Text style={styles.colPrice}>
                Prix unit.
              </Text>

              <Text style={styles.colTotal}>
                Total
              </Text>
            </View>

            {itemsWithTotal.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.colProduct}>
                  {`• ${item.name}`}
                </Text>

                <Text style={styles.colQuantity}>
                  {item.quantity}
                </Text>

                <Text style={styles.colPrice}>
                  {XAF.format(Number(item.price))}
                </Text>

                <Text style={styles.colTotal}>
                  {XAF.format(item.total)}
                </Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Sous-total
              </Text>

              <Text style={styles.totalValue}>
                {XAF.format(subTotal)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Livraison
              </Text>

              <Text style={styles.totalValue}>
                {XAF.format(deliveryPrice)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Total TTC
              </Text>

              <Text style={styles.totalValue}>
                {XAF.format(Number(order.total))}
              </Text>
            </View>
          </View>
        </View>

        {/* Statut */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Statut de la commande
          </Text>

          <View style={styles.statusContainer}>
            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>
                Statut
              </Text>

              <Text style={styles.statusValue}>
                {order.status}
              </Text>
            </View>

            <View style={styles.statusBox}>
              <Text style={styles.statusLabel}>
                Source
              </Text>

              <Text style={styles.statusValue}>
                {order.source}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
            Merci de votre confiance !
          </Text>

          <Text>
            Ce document fait office de preuve d'achat.
          </Text>

          <Text>
            Généré le{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default OrderPDF;