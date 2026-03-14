import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default function App() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    try {
      const response = await axios.post(`${API_URL}/ai-check`, {
        user_id: 1,
        symptoms: symptoms
      });
      setResult(response.data.analysis);
    } catch (error) {
      Alert.alert("Error", "Could not connect to AI Service");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>HealthAI Companion</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe symptoms..."
        value={symptoms}
        onChangeText={setSymptoms}
      />
      <Button title="Analyze" onPress={handleCheck} />
      {result && (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Risk Level: {result.risk}</Text>
          <Text style={styles.resultText}>{result.recommendation}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f0f2f5' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 15, borderRadius: 8, marginBottom: 15, backgroundColor: 'white' },
  result: { marginTop: 20, padding: 15, backgroundColor: '#e3f2fd', borderRadius: 8 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#1565c0' },
  resultText: { fontSize: 14, marginTop: 5 }
});