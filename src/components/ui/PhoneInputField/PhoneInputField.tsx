import { colors } from "@/constants/colors";
import { fonts } from "@/constants/styles";
import React, { FC, useEffect, useImperativeHandle, useRef } from "react";
import { Control, useController } from "react-hook-form";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ThemedText from "../ThemedText/ThemedText";

export interface PhoneInputFieldRef {
  focus: () => void;
}

interface IField {
  name: string;
  control: Control<any>;
  error?: any;
  placeholder: string;
}
const PhoneInputField: FC<IField> = (props) => {
  const colorScheme = useColorScheme() || "light";
  const { name, control, error, placeholder } = props;
  const rules = {
    required: "Введите номер телефона",
    pattern: {
      value: /^(?:\+7|\b8)\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
      message: "Введите номер телефона",
    },
  };

  const { field } = useController({
    control,
    name,
    rules,
  });

  useEffect(() => {
    if (field.value) {
      raisePlaceholder();
    }
  }, []);

  const phoneChangeHandler = (newValue: string) => {
    const regex = /[0-9]|\+/;

    const oldValue = field.value ? field.value : "";
    if (oldValue.length - newValue.length == 1) {
      field.onChange(newValue);
      return;
    }
    newValue = newValue.replaceAll(/\D/g, "");
    const lastSymbol = newValue[newValue.length - 1];

    if (regex.test(lastSymbol)) {
      if (newValue.length == 1 && newValue[0] != "7" && newValue[0] != "8") {
        newValue = "7" + newValue;
      }
      if (newValue[0] == "7" || newValue[0] == "8") {
        newValue =
          "+7 (" +
          (newValue[1] ? newValue[1] : "") +
          (newValue[2] ? newValue[2] : "") +
          (newValue[3] ? newValue[3] + ") " : "") +
          (newValue[4] ? newValue[4] : "") +
          (newValue[5] ? newValue[5] : "") +
          (newValue[6] ? newValue[6] + "-" : "") +
          (newValue[7] ? newValue[7] : "") +
          (newValue[8] ? newValue[8] + "-" : "") +
          (newValue[9] ? newValue[9] : "") +
          (newValue[10] ? newValue[10] : "");
        field.onChange(newValue);
        return;
      }
    }
  };

  const placeholderTop = useSharedValue(11);
  const inputColor = useSharedValue(colors.inputGray);
  const raisePlaceholder = () => {
    placeholderTop.value = withTiming(-9);
  };

  const downPlaceholder = () => {
    placeholderTop.value = withTiming(11);
  };

  const makeInputColorFocused = () => {
    inputColor.value = withTiming(colors.purple);
  };

  const makeInputColorUnfocused = () => {
    inputColor.value = withTiming(colors.gray);
  };
  const animatedBorderColor = useAnimatedStyle(() => {
    return {
      borderColor: inputColor.value,
    };
  });

  const animatedPlaceholderColor = useAnimatedStyle(() => {
    return {
      color: inputColor.value,
    };
  });

  const animatedPlaceholderPosition = useAnimatedStyle(() => {
    return {
      top: placeholderTop.value,
    };
  });

  const handleBlur = () => {
    if (!field.value) {
      downPlaceholder();
    }
    makeInputColorUnfocused();
  };

  const handleFocus = () => {
    raisePlaceholder();
    makeInputColorFocused();
  };

  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(field.ref, () => {
    return {
      focus: () => {
        inputRef.current.focus();
      },
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputContainer,
          { backgroundColor: colors[colorScheme].white },
          animatedBorderColor,
        ]}
      >
        <TextInput
          placeholder=""
          ref={inputRef}
          style={[styles.input, { color: colors[colorScheme].black }]}
          keyboardType="numeric"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={phoneChangeHandler}
          value={field.value}
        />
      </Animated.View>

      <Animated.View
        style={[styles.placeholderContainer, animatedPlaceholderPosition]}
      >
        <TouchableWithoutFeedback onPress={() => inputRef.current.focus()}>
          <Animated.Text
            style={[
              styles.placeholder,
              { backgroundColor: colors[colorScheme].white },
              animatedPlaceholderColor,
            ]}
          >
            {placeholder + "*"}
          </Animated.Text>
        </TouchableWithoutFeedback>
      </Animated.View>
      {error && <ThemedText color="red">{error?.message}</ThemedText>}
    </View>
  );
};

export default PhoneInputField;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    width: "100%",
    height: 60,
  },
  inputContainer: {
    width: "100%",
    height: 40,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    width: "100%",
    height: "100%",
    fontSize: 14,
    fontFamily: fonts.regular,
    paddingLeft: 15,
    paddingVertical: 11,
  },
  placeholderContainer: {
    position: "absolute",
    left: 12,
  },
  placeholder: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
});
