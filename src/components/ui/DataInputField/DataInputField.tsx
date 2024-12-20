import { colors } from "@/constants/colors";
import { fonts } from "@/constants/styles";
import React, { FC, useImperativeHandle, useRef, useEffect } from "react";
import { Control, useController } from "react-hook-form";
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
export interface DataInputFieldRef {
  focus: () => void;
}

interface IControllerField {
  name: string;
  control: Control<any>;
  error?: any;
  placeholder: string;
}
const DataInputField: FC<IControllerField> = (props) => {
  const { name, control, error, placeholder } = props;
  const rules = {
    required: "Введите дату рождения",
    pattern: {
      value: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d\d$/,
      message: "Дата рождения некорректная",
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
  });
  const dataChangeHandler = (newValue) => {
    const regex = /[0-9]/;
    const oldValue = field.value ? field.value : "";
    if (oldValue.length - newValue.length == 1) {
      field.onChange(newValue);
      return;
    }
    if (regex.test(newValue[newValue.length - 1]) && newValue.length < 12) {
      newValue = newValue.replaceAll(/\D/g, "");
      newValue =
        (newValue[0] ? newValue[0] : "") +
        (newValue[1] ? newValue[1] + "." : "") +
        (newValue[2] ? newValue[2] : "") +
        (newValue[3] ? newValue[3] + "." : "") +
        (newValue[4] ? newValue[4] : "") +
        (newValue[5] ? newValue[5] : "") +
        (newValue[6] ? newValue[6] : "") +
        (newValue[7] ? newValue[7] : "");
      field.onChange(newValue);
      return;
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
          onChangeText={dataChangeHandler}
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

export default DataInputField;

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
    fontFamily: fonts.regular,
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
    fontFamily: fonts.medium,
    fontSize: 14,
  },
});
