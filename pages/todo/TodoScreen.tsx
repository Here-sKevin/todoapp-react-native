/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {ActivityIndicator, Alert, FlatList, Modal, SafeAreaView, Text, TextInput, View} from 'react-native';
//import useFetch from '../shared/hooks/useFetch';
import { TodoModel, TodoType, useTodoModel } from './interface/TodoModel';
import { Button as ButtonComp } from '../../components/ui/Button'
import { Text as TextComp } from '../../components/ui/Text'
import { styles } from './TodoScreen.styles';
import TodoScreenApi from './TodoScreenApi';
import { Checkbox } from '../../components/ui/Checkbox';
import useAuthentication from '../../shared/authentication/hooks/useAuthentication';
import { useTranslation } from '../../shared/translations/Translations';
import FormControl from '../../components/ui/FormControl';

const TodoScreen: React.FC = () => {
  const { T } = useTranslation();
  const [todos, setTodos] = useState<TodoModel[] | []>([]);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete' | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  //const {data, loading, error} = useFetch<TodoType[]>('https://jsonplaceholder.typicode.com/todos');
  const [isChecked, setIsChecked] = useState(true);
  
  const {
		field,
		handleSubmit,
    reset,
    getErrors
	} = useTodoModel();

  const {user} = useAuthentication();

  useEffect(() => {

    const fetchData = async () => {
      const tdata = await TodoScreenApi.getMyTodos(user);
      console.log('Data TODOS: ', tdata)
      setTodos(tdata);
    }
    fetchData();

  }, []);

  const toggleCheckbox = async () => {
    let tdata;
    if(!isChecked)
      tdata = await TodoScreenApi.getMyTodos(user)
    else
      tdata = await TodoScreenApi.getTodos()

    setTodos(tdata);
    setIsChecked((previousState) => !previousState);
  } 

  const openModal = (type: 'create' | 'edit' | 'delete', item: TodoType | null) => {
    if(item != null) {
      reset(item);
    }
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log('Submit')
		if(modalType === 'create') {
        handleNewTodo(data);
    }
    if(modalType === 'edit') {
      handleUpdate(data);
    }
    if(modalType === 'delete') {
      handleDelete(data);
    }
	});

  const handleDelete = async (dataItem:TodoModel) => {
    try{
        await TodoScreenApi.deleteTodo(dataItem);
        let d;
      if(!isChecked)
         d = await TodoScreenApi.getTodos();
      else
         d = await TodoScreenApi.getMyTodos(user);
        setTodos(d);
        closeModal();
    } catch(error) {
      Alert.alert('Error', error.message);
    }

  }

  const handleUpdate = async (dataItem: TodoModel) => {
    if (dataItem.id === null) return;

    try {
      await TodoScreenApi.updateTodo(dataItem);
      let d;
      if(!isChecked)
         d = await TodoScreenApi.getTodos();
      else
         d = await TodoScreenApi.getMyTodos(user);
      setTodos(d);
      closeModal();    
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  const handleNewTodo = async (dataItem: TodoModel) => {
    if (!dataItem.title.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }
    try {
      await TodoScreenApi.createTodo(dataItem, user);
      let d;
      if(!isChecked)
         d = await TodoScreenApi.getTodos();
      else
         d = await TodoScreenApi.getMyTodos(user);
      setTodos(d);
      closeModal();

    } catch(error) {
      Alert.alert('Error', error.message);
    }
  }

  /*if(loading){
    return(
      <>
      <View>
        <ActivityIndicator style={{alignItems: "center", justifyContent: "center"}} size="large" />
      </View>
      </>         
    ) 
  } 
  if(error) return <Text>Error Message: {error.message}</Text>*/
  return (
    <>
      <View>
                  <View style={styles.row}>
                    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <Checkbox
                      label={T.todo_screen.buttonTodos}
                      onValueChange={toggleCheckbox}
                      value={isChecked}
                    />
                    </View>
                    <View style={styles.buttonContainer}>
                      <ButtonComp title={T.todo_screen.buttonCreate} onPress={() => openModal('create', null)} />
                    </View>
                  </View>
        
      </View>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={todos}
          renderItem={({item}) => (
            <View style={styles.item}>
                <>
                  <TextComp style={styles.title} size='lg'>{item.title}</TextComp>
                  <View>
                  <View style={styles.row}>
                    <View style={styles.buttonContainer}>
                      <ButtonComp isDisabled={item.userId === user.id ? false : true} title={T.todo_screen.buttonEdit} size='sm' variant='outline' onPress={() => {openModal('edit', item) }}/>
                    </View>
                    <View style={styles.buttonContainer}>
                      <ButtonComp isDisabled={item.userId === user.id ? false : true} title={T.todo_screen.buttonDelete} size='sm' variant='outline' onPress={() => {
                        openModal('delete', item);
                      }} />
                    </View>
                  </View>
                    
                    
                  </View>
                </>
            </View>
          )}          
        />

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
         {modalType === "create" && (
          <>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <FormControl errors={getErrors('title')}>
              <TextInput style={styles.input} placeholder='New Todo' /*value={newTitle}*/ /*onChangeText={setNewTitle}*/ onChangeText={(e) => field('title').onChange(e)} />
            </FormControl>
                
                  <View style={styles.row}>
                    <View style={styles.buttonContainer}>
                      <ButtonComp title={T.todo_screen.buttonCancel} onPress={closeModal} />
                    </View>
                    <View style={styles.buttonContainer}>
                      <ButtonComp title={T.todo_screen.buttonCreate} onPress={() => onSubmit()} />
                    </View>
                  </View>
            </View>         
          </View>
            
          </>          
         )}
 
        {modalType === "edit" && (
          <>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <FormControl errors={getErrors('title')}>
              <TextInput style={styles.input} value={field('title').value} /*onChangeText={setEditTitle}*/ onChangeText={(e) => field('title').onChange(e)} />
            </FormControl>
              
                  <View style={styles.row}>
                    <View style={styles.buttonContainer}>
                      <ButtonComp title={T.todo_screen.buttonCancel} onPress={closeModal} />
                    </View>
                    <View style={styles.buttonContainer}>
                      <ButtonComp title={T.todo_screen.buttonEdit} onPress={() => onSubmit()} />
                    </View>
                  </View>
            </View>         
          </View>
            
          </>    
         )}

        {modalType === "delete" && (
          <>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
              <Text>Quer Apagar o todo: {field('title').value}  ?</Text>
                    <View style={styles.row}>
                      <View style={styles.buttonContainer}>
                        <ButtonComp title={T.todo_screen.buttonCancel} onPress={closeModal} />
                      </View>
                      <View style={styles.buttonContainer}>
                      <ButtonComp title={T.todo_screen.buttonDelete} onPress={() => onSubmit()} />
                      </View>
                    </View>
              </View>         
            </View> 
          </>      
         )}
      </Modal>
      </SafeAreaView>
    </>
  );
};

export default TodoScreen;
 