import { theme } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.blue,
  },
  title: {
    color: theme.colors.white,
    fontFamily: theme.fontFamily.medium,
    fontSize: 18,
  },
});
