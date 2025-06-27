import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Safe, Title, Texto } from './styles';
const LeituraScreen = () => {
  const [nfcEnabled, setNfcEnabled] = useState<boolean | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    NfcManager.start()
      .then(() => NfcManager.isEnabled())
      .then(setNfcEnabled)
      .catch(() => setNfcEnabled(false));

    return () => {
      NfcManager.close();
    };
  }, []);

  const salvarLeitura = async (conteudo: string) => {
    try {
      const nova = {
        id: Date.now(),
        data: new Date().toLocaleString(),
        conteudo,
      };
      const atual = await AsyncStorage.getItem('leituras');
      const lista = atual ? JSON.parse(atual) : [];
      lista.unshift(nova);
      await AsyncStorage.setItem('leituras', JSON.stringify(lista));
    } catch (e) {
      console.error('Erro ao salvar leitura:', e);
    }
  };

  const readTag = async () => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      let conteudo = '';

      if (tag && tag.ndefMessage) {
        const textos = tag.ndefMessage.map((record) =>
          Ndef.text.decodePayload(
            record.payload instanceof Uint8Array
              ? record.payload
              : new Uint8Array(record.payload)
          )
        );
        conteudo = textos.join('\n');
      } else {
        conteudo = JSON.stringify(tag);
      }

      await salvarLeitura(conteudo);
      Alert.alert('Tag Lida', conteudo);
    } catch (ex) {
      console.warn('Erro ao ler NFC', ex);
      Alert.alert('Erro', 'Não foi possível ler o cartão.');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  const writeMultipleFields = async () => {
    if (!nome.trim() || !email.trim() || !telefone.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de gravar.');
      return;
    }

    try {
      const records = [
        Ndef.textRecord(`Nome: ${nome.trim()}`),
        Ndef.uriRecord(`mailto:${email.trim()}`),
        Ndef.uriRecord(`tel:${telefone.trim()}`),
      ];

      const bytes = Ndef.encodeMessage(records);

      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);

      Alert.alert('Sucesso', 'Dados gravados com sucesso!');
      setNome('');
      setEmail('');
      setTelefone('');
    } catch (err) {
      console.warn('Erro ao gravar múltiplos:', err);
      Alert.alert('Erro', 'Não foi possível gravar na tag.');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <Safe style={styles.container}>
      <Title style={styles.title}>Leitura NFC</Title>
      <Title style={styles.subtitle}>NFC está {nfcEnabled ? 'Ativado' : 'Desativado'}</Title>

      <Title style={styles.label}>Nome:</Title>
      <Texto
        
        placeholder="Ex: João da Silva"
        placeholderTextColor="#888"
        value={nome}
        onChangeText={setNome}
      />

      <Title style={styles.label}>Email:</Title>
      <Texto
       
        placeholder="Ex: teste@email.com"
        placeholderTextColor="#888"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Title style={styles.label}>Telefone:</Title>
      <Texto
        
        placeholder="Ex: +553199999999"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />

      <TouchableOpacity style={styles.button} onPress={readTag}>
        <Title style={styles.buttonText}>Ler Cartão</Title>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={writeMultipleFields}>
        <Title style={styles.buttonText}>Gravar na Tag</Title>
      </TouchableOpacity>
    </Safe>
  );
};

export default LeituraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#FFFFFF',
  }
});
