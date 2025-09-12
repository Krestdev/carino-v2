import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font, renderToBuffer } from "@react-pdf/renderer";
import { ReceiptProps } from "@/types/types";


Font.register({
    family: "merchant",
    src: 'https://res.cloudinary.com/dxpmvi0lp/raw/upload/v1741769904/merchant_nflzjj.ttf', // Use a public path
  });

// Styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "merchant"
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  commandInfo:{
    paddingVertical: 10,
    borderTop: "1px dashed #000",
    borderBottom: "1px dashed #000",
    textAlign: "center"
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px dashed #d9d9d9",
    paddingBottom: 4,
    marginBottom: 4,
  },
  total: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
});

const Receipt:React.FC<ReceiptProps> = ({fees, due_date, commande, client_name, loyalty, Address}) => {
    const total_amount = commande.reduce((accumulator, item) => {
        const price = item.price * item.qte;
        return accumulator + price;
      }, 0);
  return (
    <Document>
      <Page size="A6" style={styles.page}>
        {/* Restaurant Name */}
        <Image src={"https://res.cloudinary.com/dxpmvi0lp/image/upload/v1741769904/logo_euxcki.jpg"} style={{ width: 75, height: 75, marginHorizontal: "auto", marginBottom: 10 }} />
        <Text style={styles.header}>{"Le Carino Pizzeria"}</Text>

        {/* Description*/}
        <View style={{marginBottom: 10, textAlign: "center"}}>
          <Text>{"Carrefour PlaYce Warda"}</Text>
          <Text>{"Yaoundé - Cameroun"}</Text>
          <Text>{"Tel: (+237) 696 54 10 55"}</Text>
          <Text>{"Email: info@le-carino.com"}</Text>
          <Text>{"RCCM: RC/DLN/2021/B/1285"}</Text>
          <Text>{"NIU: M042116077137Q"}</Text>
          <Text>Domiciliation Bange Bank: 10040 01002 38400297302 20</Text>
        </View>

        {/* Order Info */}
        <View style={styles.commandInfo}>
          <Text style={{marginBottom:2}}>Type de commande: {fees > 0 ? "Livraison" : "Emporte"}</Text>
          {due_date && <Text style={{marginBottom:2}}>A livrer le : {due_date.toString()}</Text>}
          <Text style={{marginBottom:2}}>Commande de: {client_name}</Text>
          <Text style={{marginBottom:2}}>{`${new Date().toString()}`}</Text>
          <Text>{`Points de fidélité : ${loyalty + Math.floor(total_amount/500)}`}</Text>
        </View>

        {/* Order Items */}
        <View style={{marginVertical:15}}>
          {commande.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text>{item.nom} x {item.qte}</Text>
              <Text>{item.price * item.qte} FCFA</Text>
            </View>
          ))}
          {fees > 0 && <View style={styles.tableRow}>
            <Text>Frais de Livraison</Text>
            <Text>{fees} FCFA</Text>
            </View>}
          {Address && <View style={styles.tableRow}>
            <Text>Adresse</Text>
            <Text>{`${Address.name}, ${Address.street}`}</Text>
            </View>}
        </View>

        {/* Total */}
        <Text style={styles.total}>Total: {total_amount + fees} FCFA</Text>

        {/* Footer */}
        <Text style={{ textAlign: "center", marginTop: 20, borderTop: "1px dashed #000", paddingTop: 10 }}>
          {"Merci pour votre visite !"}
        </Text>
      </Page>
    </Document>
  );
};

export default Receipt;

export async function receiptBuffer(data:ReceiptProps){
  const stream = await renderToBuffer(<Receipt {...data}/>);
  return stream;
} 