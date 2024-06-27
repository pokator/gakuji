import * as React from "react";
import { StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { XGroup, Button } from "tamagui";

const SegmentedControl = ({ onChange }) => {
  const [value, setValue] = React.useState("kanji");

  const onValueChange = (value : string) => {
    setValue(value);
    onChange(value);
  };

  function valueChanged(value : string) {
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

      {/* <XGroup>
        <XGroup.Item>
          <Button width="25%" size="$2" theme="active" onPress={valueChanged}>
            漢字
          </Button>
        </XGroup.Item>

        <XGroup.Item>
          <Button width="25%" size="$2" variant="outlined">
            ひらがな
          </Button>
        </XGroup.Item>
      </XGroup> */}
    </View>
  );
};

{
  /* <XGroup>
<XGroup.Item>
  <Button width="50%" size="$2" disabled opacity={0.5}>
    disabled
  </Button>
</XGroup.Item>

<XGroup.Item>
  <Button width="50%" size="$2" chromeless>
    chromeless
  </Button>
</XGroup.Item>
</XGroup> */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SegmentedControl;
