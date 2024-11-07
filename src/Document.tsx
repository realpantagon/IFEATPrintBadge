import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
} from "@react-pdf/renderer";
import React from "react";

export const MyDocument = ({ data }) => {
    // Fallback images
    const defaultPhotoUrl = "https://placehold.co/800x600";
    const defaultQrUrl = "https://placehold.co/600x400";
    const defaultBgUrl = "https://placehold.co/600x400";

    // Extract URLs safely with fallback
    const photoUrl = data?.Photo_Attach?.[0]?.url || defaultPhotoUrl;
    const qrUrl = data?.QR_Contact?.[0]?.url || defaultQrUrl;
    const bgUrl = data?.BG_Type?.[0]?.url || defaultBgUrl;

    return (
        <Document>
            {/* Duplicate page */}
            {[1, 2].map((_, index) => (
                <Page key={index} size={{ width: 378, height: 454 }}>
                    <View style={styles.page}>
                        <View style={styles.center}>
                            <Image style={styles.image} src={photoUrl} />
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
                                <Image style={styles.qrCode} src={qrUrl} />
                                <Text style={styles.refId}>{data?.Ref_ID || " "}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.bgImage}>
                        <Image src={bgUrl} />
                    </View>
                </Page>
            ))}
        </Document>
    );
};

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
        width: "38%",
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

export default MyDocument;
