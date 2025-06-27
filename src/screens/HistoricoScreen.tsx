import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Picker } from '@react-native-picker/picker';

type Leitura = {
  id: number;
  data: string;
  conteudo: string;
};

const HistoricoScreen = () => {
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [ordenacao, setOrdenacao] = useState<'recente' | 'antigo'>('recente');

  useEffect(() => {
    carregarLeituras();
  }, []);

  useEffect(() => {
    ordenarLeituras(ordenacao);
  }, [ordenacao]);

  const carregarLeituras = async () => {
    try {
      const data = await AsyncStorage.getItem('leituras');
      const parsed = data ? JSON.parse(data) : [];
      ordenarLeituras(ordenacao, parsed);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    }
  };

  const ordenarLeituras = (tipo: 'recente' | 'antigo', base?: Leitura[]) => {
    const lista = base || leituras;
    const ordenada = [...lista].sort((a, b) => {
      if (tipo === 'recente') return b.id - a.id;
      return a.id - b.id;
    });
    setLeituras(ordenada);
  };

  const deletarLeitura = (id: number) => {
    Alert.alert('Confirmação', 'Deseja apagar esta leitura?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          try {
            const novaLista = leituras.filter((item) => item.id !== id);
            setLeituras(novaLista);
            await AsyncStorage.setItem('leituras', JSON.stringify(novaLista));
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível deletar.');
          }
        },
      },
    ]);
  };


  const apagarTudo = async () => {
    Alert.alert('Confirmação', 'Deseja apagar todo o histórico?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('leituras');
            setLeituras([]);
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível apagar o histórico.');
          }
        },
      },
    ]);
  };

  const compartilharLeitura = async (leitura: Leitura) => {
    try {
      await Share.share({
        message: `📅 ${leitura.data}\n📎 ${leitura.conteudo}`,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar.');
    }
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Histórico de Leituras</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Ordenar por:</Text>
        <Picker
          selectedValue={ordenacao}
          style={styles.picker}
          onValueChange={(itemValue) => setOrdenacao(itemValue)}
        >
          <Picker.Item label="Mais recentes" value="recente" />
          <Picker.Item label="Mais antigas" value="antigo" />
        </Picker>
      </View>

      {leituras.length > 0 && (
        <TouchableOpacity style={styles.clearAllBtn} onPress={apagarTudo}>
          <Text style={styles.clearAllText}>🗑 Apagar tudo</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {leituras.length === 0 ? (
          <Text style={styles.vazio}>Nenhuma leitura registrada.</Text>
        ) : (
          leituras.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.data}>{item.data}</Text>
              <Text style={styles.conteudo}>{item.conteudo}</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.deletarBtn}
                  onPress={() => deletarLeitura(item.id)}
                >
                  <Text style={styles.deletarText}>🗑 Apagar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={() => compartilharLeitura(item)}
                >
                  <Text style={styles.shareText}>📤 Compartilhar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoricoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 20,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  vazio: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    marginTop: 50,
  },
  card: {
    backgroundColor: '#e0ffe0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  data: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
  },
  conteudo: {
    fontSize: 16,
    marginBottom: 10,
  },
  deletarBtn: {
    marginRight: 10,
  },
  deletarText: {
    color: 'red',
    fontWeight: 'bold',
  },
  clearAllBtn: {
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#f55',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearAllText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  pickerLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  shareBtn: {
    marginLeft: 10,
  },
  shareText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});