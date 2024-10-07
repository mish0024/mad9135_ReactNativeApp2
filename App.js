import React, { useState, useEffect, useCallback, useRef } from "react";
import { FAB } from '@rneui/themed'; 
import { SafeAreaProvider } from "react-native-safe-area-context";
import {Platform,FlatList,SafeAreaView,StyleSheet,Text,View,} from "react-native"; 
import UserAvatar from "react-native-user-avatar";


const App = () => {
  const isFirstRender = useRef(true);
  const [userList, setUserList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);


  const fetchSingleUser = useCallback(() => {
    fetch("https://random-data-api.com/api/v2/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching the user");
        }
        return res.json();
      })
      .then((data) => {
        setUserList((list) => [...list, data]);
      })
      .catch((e) => {
        console.error("Error:", e);
      });
  }, []);


  const fetchUsers = useCallback(() => {
    fetch("https://random-data-api.com/api/v2/users?size=10")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching users");
        }
        return res.json();
      })
      .then((data) => {
        setUserList(data);
      })
      .catch((e) => {
        console.error("Error:", e);
      });
  }, []);

  useEffect(() => {
    if (!isFirstRender.current) {
      fetchSingleUser();
    } else {
      isFirstRender.current = false;
    }
  }, [fetchSingleUser]);

  const refreshUsers = () => {
    setIsRefreshing(true);
    fetchUsers();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const renderUserItem = ({ item }) => (
    <View
      style={
        Platform.OS === "ios"
          ? styles.iosRow
          : styles.defaultRow
      }
    >
      <UserAvatar
        style={styles.avatar}
        size={50}
        name={item.first_name}
        src={item.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.firstName}>{item.first_name}</Text>
        <Text style={styles.lastName}>{item.last_name}</Text>
      </View>
    </View>
  );

  const extractKey = (item) => item.id.toString();

  return (
    <SafeAreaProvider style={styles.wrapper}>
      <SafeAreaView>
        <FlatList
          data={userList}
          renderItem={renderUserItem}
          keyExtractor={extractKey}
          refreshing={isRefreshing}
          onRefresh={refreshUsers}
        />
        <FAB
          icon={{ name: 'add', color: 'white' }}
          color="darkgreen"
          size="large"
          placement="right"
          onPress={fetchSingleUser}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  firstName: {
    fontSize: 17,
    fontWeight: "bold",
  },
  lastName: {
    fontSize: 15,
    color: "#888",
  },
  iosRow: {
    flexDirection: "row-reverse",
    paddingVertical: 14,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  defaultRow: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
});

export default App;