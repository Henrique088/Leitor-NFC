import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  View,
} from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';


type Leitura = {
  id: number;
  data: string;
  conteudo: string;
};

function App() {



  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [nfcEnabled, setNfcEnabled] = useState<boolean | null>(null);
  const [tagInfo, setTagInfo] = useState<string | null>(null);
  const [textToWrite, setTextToWrite] = useState('');

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
      NfcManager.setEventListener(NfcTech.Ndef, null);
    };
  }, []);

  const readTag = async () => {
    try {

      // Solicita tecnologia NFC
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Lê a tag
      const tag = await NfcManager.getTag();
      console.log('Tag NFC lida:', tag);

      let conteudo = '';

      if (tag && tag.ndefMessage) {
        const ndefRecords = tag.ndefMessage;
        if (ndefRecords.length > 0) {
          const textos = ndefRecords.map((record) =>
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
      } else {
        conteudo = JSON.stringify(tag);
      }

      // Adiciona leitura à lista
      const novaLeitura: Leitura = {
        id: Date.now(),
        data: new Date().toLocaleString(),
        conteudo,
      };

      setLeituras((prev) => [novaLeitura, ...prev]);
      setTagInfo(conteudo);

    } catch (ex) {
      console.warn('Erro ao ler NFC', ex);
      Alert.alert('Erro', 'Não foi possível ler o cartão.');
    } finally {
      // Encerra leitura
      NfcManager.cancelTechnologyRequest();
    }
  };


  // const writeTag = async () => {
  //   if (!textToWrite.trim()) {
  //     Alert.alert('Atenção', 'Digite algum texto para gravar.');
  //     return;
  //   }

  //   try {
  //     const bytes = Ndef.encodeMessage([
  //       Ndef.textRecord(textToWrite.trim()),
  //     ]);

  //     await NfcManager.requestTechnology(NfcTech.Ndef);
  //     await NfcManager.ndefHandler.writeNdefMessage(bytes);

  //     Alert.alert('Sucesso', 'Texto gravado com sucesso na tag!');
  //     setTextToWrite('');
  //   } catch (ex) {
  //     console.warn('Erro ao gravar', ex);
  //     Alert.alert('Erro', 'Não foi possível gravar na tag.');
  //   } finally {
  //     NfcManager.cancelTechnologyRequest();
  //   }
  // };

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Leitor NFC</Text>
      <Text style={styles.subtitle}>
        NFC está {nfcEnabled ? 'Ativado' : 'Desativado'}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Digite o texto para gravar:</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: João da Silva"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: teste@email.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: +553199999999"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />

      <TouchableOpacity style={styles.button} onPress={readTag}>
        <Text style={styles.buttonText}>Ler Cartão</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.button} onPress={writeMultipleFields}>
        <Text style={styles.buttonText}>Gravar na Tag</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Leituras registradas:</Text>

      <View style={styles.leituraContainer}>
        <ScrollView>
          {leituras.length === 0 ? (
            <Text style={{ fontStyle: 'italic', color: '#666' }}>Nenhuma leitura registrada ainda.</Text>
          ) : (
            leituras.map((leitura) => (
              <Text key={leitura.id} style={styles.leitura}>
                📅 {leitura.data}{'\n'}📎 {leitura.conteudo}
              </Text>
            ))
          )}
        </ScrollView>
      </View>




      {tagInfo && (
        <Text style={styles.tagText}>Tag: {tagInfo}</Text>
      )}
    </SafeAreaView>
  );
}

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
    backgroundColor: '#0fd850',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  tagText: {
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 20,
    textAlign: 'center',
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
  },
  leituraContainer: {
    height: 200,
    width: '90%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  leitura: {
    backgroundColor: '#e0ffe0',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 18,
  }



});

export default App;
