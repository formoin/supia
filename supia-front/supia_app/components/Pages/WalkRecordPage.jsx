import React from 'react';
import { View, Text, StyleSheet, Image } from "react-native";
import { useRoute } from '@react-navigation/native'; // import useRoute
import Header from '../atoms/Header';
import Line from '../atoms/Line';
import useStore from '../store/useStore';

export default function WalkRecordScreen() {
    const route = useRoute();
    const { distance } = route.params || {}; // get distance from route params

    const images = {
        '씨앗': require('../../assets/level/씨앗.png'),
        '새싹': require('../../assets/level/새싹.png'),
        '잎새': require('../../assets/level/잎새.png'),
        '꽃': require('../../assets/level/꽃.png'),
        '열매': require('../../assets/level/열매.png'),
    };

    const walkStartTime = useStore((state) => state.walkStartTime);
    const walkEndTime = useStore((state) => state.walkEndTime);

    const formatTime = (isoString) => {
        if (!isoString) return '00:00';
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    return (
        <View style={styles.container}>
            <Header label="산책 기록 확인" />
            <View style={styles.middleContainer}>
                <Line style={styles.lineTopSpacing} />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Start    {formatTime(walkStartTime)}</Text>
                    <Text style={styles.text}>End    {formatTime(walkEndTime)}</Text>
                </View>
                <Text style={styles.mapText}>코스 지도</Text>
                <View style={styles.rectangleContainer}>
                    <View style={styles.rectangle} />
                    {distance !== undefined && (
                        <Text>{distance.toFixed(2)}km</Text> // Display distance
                    )}
                </View>
                <Line style={styles.lineSpacing} />
                <Text style={styles.itemHeader}>획득한 아이템</Text>
                <View style={styles.itemContainer}>
                    <Image
                        source={images['씨앗']}
                        style={styles.image}
                    />
                    <Text style={styles.itemText}>씨앗</Text>
                </View>
                <Line style={styles.lineSpacing} />
                <Text style={styles.points}>적립된 Point      550P</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    middleContainer: {
        flex: 1,
        marginTop: 40,
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 40,
        marginBottom: 40,
    },
    text: {
        fontSize: 20,
    },
    mapText: {
        alignSelf: 'flex-start',
        marginLeft: 50,
        fontSize: 15,
        marginBottom: 10,
    },
    rectangleContainer: {
        width: '100%',
        alignItems: 'center',
    },
    rectangle: {
        width: 330,
        height: 200,
        backgroundColor: '#d3d3d3',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#a9a9a9',
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lineTopSpacing: {
        marginBottom: 30
    },
    lineSpacing: {
        marginVertical: 20
    },
    itemHeader: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'flex-start',
        marginLeft: 47,
    },
    itemContainer: {
        alignSelf: 'flex-start',
        marginLeft: 50,
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 15,
    },
    points: {
        fontSize: 18,
        marginTop: 40,
    }
});
