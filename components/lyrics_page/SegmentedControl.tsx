import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

const SegmentedControl = ({onChange}) => {
  const [value, setValue] = React.useState('kanji');

  const onValueChange = (value) => {
    setValue(value);
    onChange(value);
  }

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={onValueChange}
        style={{ width: '50%' }}
        buttons={[
          {
            value: 'kanji',
            label: '漢字',
          },
          {
            value: 'hiragana',
            label: 'ひらがな',
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SegmentedControl;