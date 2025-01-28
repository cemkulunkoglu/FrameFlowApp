import { StyleSheet, View, useColorScheme } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { HelloWave } from '../../components/HelloWave';

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>FrameFlow</ThemedText>
      </View>
      
      <ThemedText style={styles.subtitle}>
        Profesyonel profil fotoğrafları için çerçeve ve metin düzenleyici :)
      </ThemedText>

      <View style={styles.instructionsCard}>
        <ThemedText style={styles.cardTitle}>Nasıl Kullanılır?</ThemedText>
        {steps.map((step, index) => (
          <View key={index} style={styles.step}>
            <View style={styles.stepNumber}>
              <ThemedText style={styles.stepNumberText}>{index + 1}</ThemedText>
            </View>
            <ThemedText style={styles.stepText}>{step}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const steps = [
  'Fotoğraf Seç butonuna tıklayarak bir fotoğraf yükleyin',
  'Fotoğrafı sürükleyerek istediğiniz şekilde konumlandırın',
  'Çerçeve rengini değiştirmek için renk seçiciyi kullanın',
  'İsterseniz çerçeveye metin ekleyin ve metin rengini ayarlayın',
  'Kalite seçeneğini belirleyin ve Fotoğrafı Kaydet butonuna tıklayın'
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SF-Pro-Display-Bold',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 30,
  },
  instructionsCard: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'SF-Pro-Display-Bold',
    marginBottom: 15,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0071e3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'SF-Pro-Display-Medium',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
  },
});
