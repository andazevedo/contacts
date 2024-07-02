import {
  TouchableOpacity,
  Text,
  ImageProps,
  TouchableOpacityProps,
} from "react-native";
import { styles } from "./styles";
import { Avatar } from "@/app/components/avatar";

export type ContactProps = {
  id: string;
  name: string;
  image?: ImageProps | null;
};

type Props = TouchableOpacityProps & {
  contact: ContactProps;
};

export function Contact({ contact, ...rest }: Props) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Avatar name={contact.name} image={contact.image} />
      <Text style={styles.name}>{contact.name}</Text>
    </TouchableOpacity>
  );
}
