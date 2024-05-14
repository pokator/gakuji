import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { FAB, Portal} from "react-native-paper";

const AddButton = () => {
  const [open, setOpen] = useState(false);

  const onStateChange = ({ open }) => setOpen(open);

  return (
    <Portal>
      <FAB.Group
        // style={styles.fabContainer}
        visible={true}
        open={open}
        icon={open ? "close" : "plus"}
        style={styles.fabContainer}
        rippleColor={"red"}
        // backdropColor="white"
        // variant="surface"
        actions={[
          {
            icon: "star",
            label: "From Link",
            onPress: () => console.log("Option 1 pressed"),
            labelTextColor: "black",
          },
          {
            icon: "heart",
            label: "Manual Entry",
            onPress: () => console.log("Option 2 pressed"),
            labelTextColor: "black",
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    // Add this style
    position: "absolute",
    bottom: -32,
    right: 0,
  },
});

export default AddButton;
