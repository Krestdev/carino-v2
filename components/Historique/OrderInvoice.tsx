import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface OrderInvoiceProps {
  order: {
    zelty_order_id: string | number | undefined;
    customerName: string;
    phoneNumber: string;
    deliveryAddress: string;
    location: string;
    products: string[];
    deliveryFee: string;
    itemsAmount: string;
    totalAmount: string;
    is_paid: boolean;
    is_delivred: boolean;
    created_at: Date;
  };
}

const OrderInvoice = ({ order }: OrderInvoiceProps) => (

  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src="/Logo.png" style={styles.image} />
        <View style={styles.body}>
          <View style={styles.headsection}>
            <Text style={styles.headTitle}>{"Détails de la commande"}</Text>
            <Text style={styles.headDescription}>
              {
                "Service de restauration – plats et boissons consommés sur place / à emporter / Livraison."
              }
            </Text>
          </View>
          <View style={styles.section}>
            <View style={styles.subSection}>
              <Text style={styles.subSectionLabel}>{"ID de transaction:"}</Text>
              <Text style={styles.subSectionValue}>{order.zelty_order_id}</Text>
            </View>
            <View style={styles.subSection}>
              <Text style={styles.subSectionLabel}>{"Numéro de tel:"}</Text>
              <Text style={styles.subSectionValue}>{order.phoneNumber}</Text>
            </View>
            <View style={styles.subSection}>
              <Text style={styles.subSectionLabel}>
                {"Adresse de livraison:"}
              </Text>
              <Text style={styles.subSectionValue}>
                {order.deliveryAddress}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
                marginBottom: "10px",
              }}
            >
              <Text style={styles.subSectionLabel}>{"Lieu dit:"}</Text>
              <Text style={styles.subSectionLabel}>{order.location}</Text>
            </View>
          </View>
          <View style={styles.section}>
            {order.products.map((product, index: number) => {
              // Séparer le nom du prix en utilisant le séparateur " -> "
              const [productName, pricePart] = product.split(' -> ');

              // Extraire le prix (enlever "FCFA" si présent et convertir en nombre)
              const price = parseInt(pricePart.replace(' FCFA', '')) || 0;

              return (
                <View key={index} style={styles.subSection}>
                  <Text style={styles.subSectionLabel}>{`• ${productName}`}</Text>
                  <Text style={styles.subSectionValue}>{`${price} FCFA`}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.section}>
            <View style={styles.subSection}>
              <Text style={styles.subSectionLabel}>{"Commande:"}</Text>
              <Text style={styles.subSectionValue}>{order.itemsAmount}</Text>
            </View>
            <View style={styles.subSection}>
              <Text style={styles.subSectionLabel}>
                {"Frais de livraison:"}
              </Text>
              <Text style={styles.subSectionValue}>{order.deliveryFee}</Text>
            </View>
            <View style={styles.subSection}>
              <Text style={styles.subSectionLabel}>{"Total:"}</Text>
              <Text style={styles.subSectionValue}>{order.totalAmount}</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default OrderInvoice;

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 70,
    fontSize: 12,
    fontFamily: "Helvetica",
    width: "100%",
  },
  header: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "100%",
    width: "100%",
    paddingVertical: "10px",
    paddingHorizontal: "50px",
    backgroundColor: "white",
  },
  image: {
    position: "absolute",
    top: "-50px",
    left: "40%",
    width: "120px",
    height: "120px",
    objectFit: "cover",
    zIndex: 20,
    borderRadius: "60px",
  },
  body: {
    position: "relative",
    width: "550px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    border: "1px solid #000",
    padding: "70px 32px 28px 32px",
    zIndex: 0,
  },
  headsection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  headTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    width: "300px",
  },
  headDescription: {
    fontSize: "12px",
    fontWeight: "normal",
    color: "#000",
    textAlign: "center",
    width: "250px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
    borderBottom: "1px solid #848484",
    marginBottom: "8px",
  },
  subSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  subSectionLabel: {
    fontWeight: "normal",
    fontSize: "16px",
    width: "60%",
  },
  subSectionValue: {
    fontWeight: "bold",
    fontSize: "16px",
  },
});
