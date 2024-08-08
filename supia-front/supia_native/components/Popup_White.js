import React from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios'
import {Server_IP, WS_IP, TURN_URL, TURN_ID, TURN_CREDENTIAL} from '@env';


const token =
'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMTFAbmF2ZXIuY29tIiwibWVtYmVySWQiOjcsImlhdCI6MTcyMzAzODYzMCwiZXhwIjoxNzU0NTc0NjMwfQ.2SlikAZj11iqc333a-II1MjPYCxLGynSLnQs4RLwAe-BVMavQzeKozWm77SZqFrzWbvVpczyUlPNt9MAnpWB4g'

const Popup_White = ({ri, dong, code}) => {
  const [speciesData, setSpeciesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // api 받아오기
    const fetchSpeciesData = async () => {
      try {
        const response = await axios.get(`${Server_IP}/walk`, {
          headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
          },
          params: {
              address: code,
          },
      });

        console.log(response.data)
        const data = response.data
        // const data = await response.json();

        setSpeciesData(data);
      } catch (error) {
        console.error('err', error);
      } finally {
        setLoading(false);
      }
    };
    console.log(dong, code)
    fetchSpeciesData();
  }, [dong, code]);

  return (
    <View style={styles.rectangle}>
      <Text style={styles.text}>
        {ri ? `${ri}에서 발견된 자연물` : `${dong}에서 발견된 자연물`}
      </Text>
      <View style={styles.line} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : speciesData.length > 0 ? (
        speciesData.map((species, index) => (
          <View key={index} style={styles.container}>
            <Image source={{uri: species.imageUri}} style={styles.image} />
            <Text style={styles.p_text}>{species.name}</Text>
            {/* <View style={styles.line} /> */}
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>발견된 자연물이 없습니다</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  rectangle: {
    display: 'flex',
    width: 240,
    height: 278,
    borderRadius: 6,
    backgroundColor: '#fff',
    opacity: 0.7,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  text: {
    padding: 20,
  },
  p_text: {
    paddingTop: 10,
    paddingLeft: 20,
  },
  line: {
    width: 240,
    height: 1,
    transform: [{rotate: '0.177deg'}],
    borderWidth: 1,
    borderColor: '#A2AA7B',
    opacity: 1,
  },
  noDataText: {
    padding: 20,
    textAlign: 'center',
    color: 'gray',
  },
});

export default Popup_White;
