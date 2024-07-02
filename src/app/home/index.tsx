import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity, Alert, SectionList, Text } from "react-native";
import { styles } from "./styles";
import { Input } from "../components/input";
import { theme } from "@/theme";
import { useState, useEffect, useId, useRef } from "react";
import { Contact, ContactProps } from "../components/contact";
import * as Contacts from "expo-contacts";
import BottomSheet from "@gorhom/bottom-sheet";
import { Avatar } from "../components/avatar";
import { Button } from "../components/button";

type SectionListDataProps = {
  title: string;
  data: ContactProps[];
};

export function Home() {
  const [contacts, setContacts] = useState<SectionListDataProps[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState<Contacts.Contact>();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleBottomSheetOpen = () => bottomSheetRef.current?.expand();
  const handleBottomSheetClose = () => bottomSheetRef.current?.snapToIndex(0);

  async function handleOpenDetails(id: string) {
    const response = await Contacts.getContactByIdAsync(id);
    setContact(response);

    handleBottomSheetOpen();
  }

  async function fetchContacts() {
    try {
      const permission = await Contacts.requestPermissionsAsync();

      if (permission.status === Contacts.PermissionStatus.GRANTED) {
        const allContacts = await Contacts.getContactsAsync({
          // sort: "firstName",
          //name: name You can use it like this or just name because it has the same name as the state
          name,
        });

        const cleanedData = allContacts.data.map((contact) => ({
          id: contact.id ?? useId(),
          name: contact.name.trim(),
          image: contact.image,
        }));

        const sortedData = cleanedData.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const list = sortedData.reduce<SectionListDataProps[]>(
          (acc: any, item) => {
            const firstLetter = item.name[0]
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim()
              .toUpperCase();

            const existingEntry = acc.find(
              (entry: SectionListDataProps) =>
                entry.title.trim() === firstLetter
            );

            existingEntry
              ? existingEntry.data.push(item)
              : acc.push({ title: firstLetter, data: [item] });

            /*if (existingEntry) {
              existingEntry.data.push(item);
            } else {
              acc.push({ title: firstLetter, data: [item] });
            }*/

            return acc;
          },
          []
        );

        setContacts(list);
        setContact(allContacts.data[0]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch contacts");
    }
  }

  useEffect(() => {
    fetchContacts();
  }, [name]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Input style={styles.input}>
          <Feather name="search" size={16} color={theme.colors.gray_300} />
          <Input.Field
            placeholder="Search by name ..."
            onChangeText={setName}
            value={name}
          />
          <TouchableOpacity onPress={() => setName("")}>
            <Feather name="x" size={16} color={theme.colors.gray_300} />
          </TouchableOpacity>
        </Input>
      </View>

      <SectionList
        sections={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Contact
            contact={item}
            onPress={() => handleOpenDetails(item.id)}
            activeOpacity={0.7}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.section}>{section.title}</Text>
        )}
        contentContainerStyle={styles.contentList}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {contact && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={[0.01, 320]}
          handleComponent={() => null}
          backgroundStyle={styles.bottomSheet}
        >
          <Avatar
            name={contact.name}
            image={contact.image}
            variant="large"
            containerStyle={styles.image}
          />
          <View style={styles.bottomSheetContent}>
            <Text style={styles.contactName}>{contact.name}</Text>
            {contact.phoneNumbers && (
              <View style={styles.phoneNumber}>
                <Feather name="phone" size={18} color={theme.colors.gray_400} />
                <Text style={styles.phone}>
                  {contact.phoneNumbers[0].number}
                </Text>
              </View>
            )}
            <Button title="Close" onPress={handleBottomSheetClose} />
          </View>
        </BottomSheet>
      )}
    </View>
  );
}
