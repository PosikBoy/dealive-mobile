import { colors } from "@/constants/colors";
import React, {
	FC,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Control, useController } from "react-hook-form";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface IField {
  type?: "default" | "password";
  placeholder: string;
  error?: any;
  name: string;
  control: Control<any>;
}
const InputField: FC<IField = (props, ref) => {
  const {
    type = "default",
    placeholder,
    name,
    error,
    control,
  } = props;

  const { field } = useController({
    control,
    name,
  });
  const placeholderTop = useSharedValue(11);
  const inputColor = useSharedValue(colors.inputGray);
  const raisePlaceholder = () => {
    placeholderTop.value = withTiming(-9);
  };
  const downPlaceholder = () => {
    placeholderTop.value = withTiming(11);
  };
  const makeInputColorFocused = () => {
    inputColor.value = withSpring(colors.purple);
  };
  const makeInputColorUnFocused = () => {
    inputColor.value = withSpring(colors.gray);
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
  const handleBlur = () => {
    if (field.value === "") {
      downPlaceholder();
    }
    makeInputColorUnFocused();
	};
	
  const handleFocus = () => {
    raisePlaceholder();
    makeInputColorFocused();
	};
	
  useImperativeHandle(field.ref, () => {
    return {
      focus: () => {
        inputRef.current.focus();
      },
    };
  });

  const inputRef = useRef<TextInput>(null);
  const handleChange = (e) => {
    field.onChange(e);
  };
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputContainer, animatedBorderColor]}>
        <TextInput
          placeholder=""
          ref={inputRef}
          secureTextEntry={type === "password"}
          style={styles.input}
          keyboardType="default"
          onFocus={handleFocus}
          onChangeText={handleChange}
          onBlur={handleBlur}
        />
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          top: placeholderTop,
          left: 12,
          backgroundColor: colors.white,
          paddingHorizontal: 5,
        }}
      >
        <TouchableWithoutFeedback onPress={() => inputRef.current.focus()}>
          <Animated.Text style={[styles.placeholder, animatedPlaceholderColor]}>
            {placeholder}
          </Animated.Text>
        </TouchableWithoutFeedback>
      </Animated.View>
      {error && <Text style={{ color: colors.red }}>{error?.message}</Text>}
    </View>
  );
};

export default InputField;

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
    paddingLeft: 12,
    paddingVertical: 11,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: colors.inputGray,
  },
});
