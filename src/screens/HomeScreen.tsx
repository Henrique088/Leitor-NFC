import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { Container, Title, Button } from './styles';
const HomeScreen = () => {
    const navigation = useNavigation<any>();


    return (
        <Container >
            <Title >📲 Leitor NFC</Title>

            <Button
                
                onPress={() => navigation.navigate('Ler')}

            >
                <Title >
                    Ler NFC
                </Title>
            </Button>

            <Button
                style={ { backgroundColor: '#A8D8EA' }}
                onPress={() => navigation.navigate('Historico')}
            >
                <Title >Ver histórico</Title>
            </Button>
        </Container>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '${props => props.theme.background}',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#0c0c0c',
    },
    button: {
        width: '80%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#0fd850',
        alignItems: 'center',
        marginVertical: 10,
        shadowColor: '#000',
        elevation: 2,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
