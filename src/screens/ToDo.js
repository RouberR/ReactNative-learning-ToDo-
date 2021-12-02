import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, FlatList, Text, Alert } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux'
import { setTasks, setTasksID } from '../redux/actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GlobalStyle from '../utils/GlobalStyle'
import CheckBox from '@react-native-community/checkbox'
const ToDo = ({ navigation }) => {
  const { tasks } = useSelector(state => state.taskReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    getTasks()
  }, [])

  const getTasks = () => {
    AsyncStorage.getItem('Tasks')
      .then(tasks => {
        const parsedTasks = JSON.parse(tasks)
        if (parsedTasks && typeof parsedTasks === 'object') {
          dispatch(setTasks(parsedTasks))
        }
      })
      .catch(error => console.log(error))
  }
  const deleteTasl = id => {
    const filteredTasks = tasks.filter(task => task.ID !== id)
    AsyncStorage.setItem('Tasks', JSON.stringify(filteredTasks))
      .then(() => {
        dispatch(setTasks(filteredTasks))
        Alert.alert('Success!', 'Task removed successfully')
      })
      .catch(err => console.log(err))
  }

  const checkTask = (id, newValue) => {
    let index = tasks.findIndex(task => task.ID === id)
    if (index > -1) {
      let newTasks = [...tasks]
      newTasks[index].Done = newValue
      AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
        .then(() => {
          dispatch(setTasks(newTasks))
          Alert.alert('Success!', 'Task state is changed')
        })
        .catch(err => console.log(err))
    }
  }

  return (
    <View style={styles.body}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              dispatch(setTasksID(item.ID))
              navigation.navigate('Task')
            }}
          >
            <View style={styles.item_row}>
              <CheckBox
                value={item.Done}
                onValueChange={newValue => {
                  checkTask(item.ID, newValue)
                }}
              />
              <View style={styles.item_body}>
                <Text style={[GlobalStyle.CustomFontBold, styles.title]} numberOfLines={1}>
                  {item.Title}
                </Text>
                <Text style={[GlobalStyle.CustomFontTask, styles.subTitle]} numberOfLines={1}>
                  {item.Desc}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.delete}
                onPress={() => {
                  deleteTasl(item.ID)
                }}
              >
                <FontAwesome5 name={'trash'} size={25} color={'red'} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          dispatch(setTasksID(tasks.length + 1))
          navigation.navigate('Task')
        }}
      >
        <FontAwesome5 name={'plus'} size={22} color={'#ffffff'} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0080ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
    elevation: 5
  },
  item: {
    marginHorizontal: 10,
    marginVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5
  },
  title: {
    color: 'black',
    fontSize: 35,
    margin: 5
  },
  subTitle: {
    color: 'grey',
    fontSize: 40,
    margin: 5
  },
  item_row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  item_body: {
    flex: 1
  },
  delete: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ToDo
