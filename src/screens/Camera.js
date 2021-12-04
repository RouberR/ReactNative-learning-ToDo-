import React from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { useCamera } from 'react-native-camera-hooks'
import CustomButton from '../utils/CustomButton'
import RNFS from 'react-native-fs'
import { useDispatch, useSelector } from 'react-redux'
import { setTasks } from '../redux/actions'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function Camera({ navigation, route }) {
  const [{ cameraRef }, { takePicture }] = useCamera(null)
  const { tasks } = useSelector(state => state.taskReducer)
  const dispatch = useDispatch()
  const captureHandle = async () => {
    try {
      const data = await takePicture()
      const filePath = data.uri
      route.params.image(filePath)
      updateTask(route.params.id, filePath)
    } catch (error) {
      console.log(error)
    }
  }
  const updateTask = (id, path) => {
    const Task = {
      ID: id,
      Image: path
    }
    const index = tasks.findIndex(task => task.ID === id)
    
    if (index > -1) {
      
      let newTasks = [...tasks]
      newTasks[index].Image = path
      AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
        .then(() => {
          dispatch(setTasks(newTasks))
          Alert.alert('Успешно!', 'Изображение сохранено')
          navigation.goBack()
        })
        .catch(err => console.log(err))
    } else {
      let newTasks = [...tasks, Task]
      AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
      .then(() => {
        dispatch(setTasks(newTasks))
        Alert.alert('Успешно!', 'Изображение сохранено')
        navigation.goBack()
      })
      .catch(err => console.log(err))
      console.log(newTasks)
    }
  }
  return (
    <View style={styles.body}>
      <RNCamera ref={cameraRef} type={RNCamera.Constants.Type.back} style={styles.preview}>
        <CustomButton text="Сохранить" color="#49BBE860" onPressHandler={() => captureHandle()} style={{marginBottom: 20}}/>
      </RNCamera>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  }
})
