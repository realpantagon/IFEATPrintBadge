import {
    Document,
    Page,
    Text,
    View,
    Image,
    PDFViewer,
    StyleSheet,
} from "@react-pdf/renderer";
import React from "react";

export const MyDocument = ({ data }) => (
    <Document>
        <Page size={{ width: 378, height: 454 }}>
            <View style={styles.page}>
                <View style={styles.center}>
                    <Image
                        style={styles.image}
                        src={data?.Photo || "https://placehold.co/600x400"} // Direct URL for Photo
                    />
                </View>
                <View>
                    {data ? (
                        <>
                            <Text style={styles.Fname}>{data.Use_FNAME_Badge || ""}</Text>
                            <Text style={styles.Lname}>{data.Use_LNAME_Badge || ""}</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.Fname}> </Text>
                            <Text style={styles.Lname}> </Text>
                        </>
                    )}
                </View>
                <View style={styles.bottomBox}>
                    <View>
                        <View style={styles.companyBox}>
                            {data ? (
                                <>
                                    <Text style={styles.position}>{data.Use_Position_Badge || ""}</Text>
                                    <Text style={styles.company}>{data.Use_Company_Badge || ""}</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.position}> </Text>
                                    <Text style={styles.company}> </Text>
                                </>
                            )}
                        </View>
                        <Text style={styles.country}>{data?.Use_Country_Badge || " "}</Text>
                    </View>
                    <View>
                        <Image
                            style={styles.qrCode}
                            src={(data?.QR_Contact && data.QR_Contact[0] && data.QR_Contact[0].url) || "https://placehold.co/600x400"}
                        />
                        <Text style={styles.refId}>{data?.Ref_ID || " "}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.bgImage}>
                <Image src={(data?.BG_Type && data.BG_Type[0] && data.BG_Type[0].url) || "https://placehold.co/600x400"} />
            </View>
        </Page>
    </Document>
);

// Styling for the PDF document in pixels
const styles = StyleSheet.create({
    page: {
        paddingTop: "20px",
        paddingLeft: "30px",
        paddingRight: "30px",
    },
    center: {
        alignItems: "center",
        marginBottom: "20px",
    },
    image: {
        marginTop: 5,
        width: "38%", // Matches the size of Print2 image
        height: "auto",
    },
    Fname: {
        fontWeight: "bold",
        fontSize: 30,
    },
    Lname: {
        fontSize: 20,
    },
    bottomBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "25px",
    },
    companyBox: {
        marginBottom: "35px",
    },
    position: {
        fontSize: 15,
    },
    company: {
        fontSize: 18,
    },
    country: {
        fontSize: 20,
    },
    qrCode: {
        width: 75,
        height: 75,
        margin: "auto",
    },
    bgImage: {
        paddingTop: 11,
    },
    refId: {
        fontSize: 10,
        margin: "auto",
    },
    textNormal: {
        fontSize: 10,
    },
});
