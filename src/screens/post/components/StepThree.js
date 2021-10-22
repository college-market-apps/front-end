import React,{useState,useEffect} from 'react'
import * as ImagePicker from 'expo-image-picker';
import {View, Text, Button, TextInput,TouchableOpacity, StyleSheet} from 'react-native'
import * as yup from "yup";
import { Formik } from "formik";
const reviewSchema = yup.object({
    price: yup.number().required(),
    title: yup.string().required(),
    description: yup.string().required(),
    placesCanMeet: yup.string().required(),
    condition: yup.string().required(),
});
const initFormik = { title: "" , description: '', placesCanMeet:'', condition: '',}

export default (props)=>{
    const {data: tags, onAddTag,onDeleteTag, onGoBack,onPostItem} = props
    const [image, setImage] = useState(null);
    const [tag,setTag] = useState('')

    function addTag(tag){
        if (!tag) return
        const exist = tags.find(x=>x === tag)
        if (exist){
            setTag('')
            return alert('you are using this tag')
        }
        onAddTag(tag)
        setTag('')
    }

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };
    return (
        <View style={styles.form}>
                <Text>Add tags for this product</Text>
                <View style={styles.tagInput}>
                    <TextInput
                        placeholder="Tag Name"
                        value={tag}
                        style={styles.tagInputFeild}
                        onChangeText={(text)=>{
                            setTag(text.toLowerCase().trim())
                        }}
                        onSubmitEditing={()=>addTag(tag)}
                    />
                    <TouchableOpacity
                        style={styles.addTag}
                        onPress={()=>addTag(tag)}
                    >
                        <Text>Add</Text>
                    </TouchableOpacity>

                </View>
            <View style={styles.tags}>
                {
                    tags.map((tag, index)=>{
                        return (
                            <View key={`__${index}`} style={styles.singleTag}>
                                <Text style={styles.tageName}>{tag}</Text>
                                <TouchableOpacity
                                    style={styles.deleteTag}
                                    onPress={()=>onDeleteTag(tag)}
                                >
                                    <Text>X</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
            <View style={styles.btns}>
                <TouchableOpacity style={styles.actionButton} onPress={onGoBack}>
                    <Text>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={onPostItem}  >
                    <Text>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    form:{
        width: '100%',
        alignItems:'center',
        marginTop: 30,
        flex: 1,
    },
    tags:{
        width:'100%',
        flexDirection: 'row',
        flexWrap:'wrap'
    },
    tagInput:{
        width: '100%',
        height: 60,
        backgroundColor:'lightgrey',
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 10,
        flexDirection:'row',
        justifyContent:'space-between',
        padding: 10,
        marginTop: 10
    },
    tagInputFeild:{
        flex: 1,
        borderRadius: 10,
        backgroundColor:'white',
        height: 40,
        padding: 7
    },
    singleTag:{
        minWidth: 80,
        minHeight: 40,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: 'lightgreen',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        position: 'relative',
    },
    tageName:{
        alignContent: 'flex-start',
        marginRight: 10
    },
    addTag:{
        width: 70,
        height: 40,
        marginLeft: 10,
        backgroundColor:'lightgreen',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteTag:{
        height: 30,
        width: 30,
        backgroundColor:"red",
        borderRadius: 100,
        marginLeft: 10,
        right: 5,
        justifyContent: 'center',
        alignItems: 'center',
        // position: 'absolute',
    },
    btns:{
        flexDirection:'row',
        justifyContent:'space-around',
        width: '100%',
        marginTop: 'auto'
    },
    actionButton:{
        width: 150,
        height: 40,
        backgroundColor: 'lightgreen',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 20
    }
})
