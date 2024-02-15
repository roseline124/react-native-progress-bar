import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '../src/ProgressBar';

const color = '#139FEB';
export default function App() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          const update = prevProgress + Math.random() / 3;
          return update >= 1 ? 1 : Math.min(update, 1);
        });
      }, 300);
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Simple Progress Bar Example</Text>
      <View>
        <Text style={styles.title}>Square Progress Bar</Text>
        <ProgressBar
          progress={0.7}
          width="100%"
          height={20}
          borderWidth={0}
          color={color}
          unfilledColor="#eee"
          borderRadius={0}
          lineCap="square"
        />
      </View>
      <View style={styles.spacing}>
        <Text style={styles.title}>Round Progress Bar</Text>
        <ProgressBar
          progress={0.7}
          width="100%"
          height={20}
          borderWidth={0}
          color={color}
          unfilledColor="#eee"
        />
      </View>
      <View style={styles.spacing}>
        <Text style={styles.title}>Progress Bar With Text</Text>
        <ProgressBar
          progress={0.7}
          width="100%"
          height={20}
          borderWidth={0}
          color={color}
          unfilledColor="#eee"
          textProps={{
            text: 'hello',
            fontSize: 16,
            fontWeight: 'bold',
            color: 'yellow',
            textAlign: 'start',
          }}
        />
      </View>
      <View style={styles.spacing}>
        <Text style={styles.title}>Animated Progress Bar</Text>
        <ProgressBar
          progress={progress}
          width="100%"
          height={20}
          borderWidth={0}
          color={color}
          unfilledColor="#eee"
        />
      </View>
      <View style={styles.spacing}>
        <Text style={styles.title}>Animated Progress Bar With Text</Text>
        <ProgressBar
          progress={progress}
          width="100%"
          height={20}
          borderWidth={0}
          color={color}
          unfilledColor="#eee"
          textProps={{
            text: `${(Math.round(progress * 100) / 100) * 100}%`,
            fontSize: 13,
            fontWeight: 'bold',
            color: 'yellow',
            textAlign: 'middle',
          }}
        />
      </View>
      <View style={styles.spacing}>
        <Text style={styles.title}>loop Progress Bar</Text>
        <ProgressBar
          width="100%"
          height={20}
          borderWidth={0}
          color={color}
          unfilledColor="#eee"
          loop={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  head: {
    marginBottom: 30,
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
  spacing: {
    marginTop: 30,
  },
});
