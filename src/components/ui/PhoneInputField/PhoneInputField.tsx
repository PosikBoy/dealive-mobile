import { colors } from "@/constants/colors";
import React, {
  FC,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Control, Controller, useController } from "react-hook-form";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface IField {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
  error?: any;
}
export interface PhoneInputFieldRef {
  focus: () => void;
}

interface IControllerField {
  name: string;
  control: Control<any>;
  error?: any;
  placeholder: string;
}
const PhoneInputField: FC<IControllerField> = (props) => {
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
  const phoneChangeHandler = (newValue) => {
    const regex = /[0-9]|\+/;
    const oldValue = field.value ? field.value : "";
    if (oldValue.length - newValue.length == 1) {
      field.onChange(newValue);
      return;
    }
    if (regex.test(newValue[newValue.length - 1]) && newValue.length < 19) {
      newValue = newValue.replaceAll(/\D/g, "");
      if (newValue[0] == "9") {
        newValue = "7" + newValue;
      }
      if (newValue[0] == "7") {
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
      } else if (newValue[0] == "8") {
        newValue =
          "8 (" +
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
      <Animated.View style={[styles.inputContainer, animatedBorderColor]}>
        <TextInput
          placeholder=""
          ref={inputRef}
          style={styles.input}
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
          <Animated.Text style={[styles.placeholder, animatedPlaceholderColor]}>
            {placeholder + "*"}
          </Animated.Text>
        </TouchableWithoutFeedback>
      </Animated.View>
      {error && <Text style={{ color: colors.red }}>{error?.message}</Text>}
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
    color: colors.black,
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    paddingLeft: 15,
    paddingVertical: 11,
  },
  placeholderContainer: {
    position: "absolute",
    left: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 5,
  },
  placeholder: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
  },
});
