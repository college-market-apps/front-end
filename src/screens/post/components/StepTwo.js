import React,{useState} from 'react'
import {View, Text,TextInput,TouchableOpacity, KeyboardAvoidingView, StyleSheet} from 'react-native'
import * as yup from "yup";
import { Formik } from "formik";
const reviewSchema = yup.object({
    price: yup.number().required(),
    title: yup.string().required(),
    description: yup.string().required(),
    // placesCanMeet: yup.string().required(),
    condition: yup.string().required(),
    // sellType: yup.string().required(),
});

export default (props)=>{
    const {onSubmitFormik,nextStep,onGoBack, data, itemType} = props
    const [price,setPrice] = useState('0')
    function handleChangePrice(strNum){
            strNum = strNum.replace('$', '').split('').reduce((a,c)=>{
                if (c === ',') return a
                return a + c
            },'')
        const nums = ['1','2','3','4','5','6','6','7','8','9','0']
        const notNum = strNum.split('').some(x=>!nums.includes(x))
        if (!strNum || strNum === '0') return setPrice(0)
        if (notNum || strNum === '00') return
        const num = Math.floor(Number(strNum))
        const cammaSep = String(num).split('').reverse().reduce((accum,intNum,index)=>{
                if (index%3 === 0 && index !== 0){
                    intNum = ','+intNum
                }
                return accum + intNum
            },'')
        setPrice(cammaSep.split('').reverse().join(''))
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.form}
        >
            <Formik
                initialValues={{...data, price}}// tags:'', images:''}}
                validationSchema={reviewSchema}
                onSubmit={(values, { setSubmitting, setFieldError,resetForm }) => {
                    let strInt = price.split('').reduce((a,c)=>{
                        if (c === '$' || c===',') return a
                        return a + c
                    },'')
                    values.price = Number(strInt) //* 100 // get pennies
                    try {
                        values.price = Number(values.price)
                        onSubmitFormik(values)
                        nextStep()
                    } catch (error) {
                        console.log('error submiting--->', error)
                    }
                }}
            >
                {
                    (formikProps)=>{
                        const {errors} = formikProps
                        return (
                            <View style={styles.formik}>
                                <View style={styles.textInput}>
                                    <Text style={styles.formTitle}>{itemType} Price</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        // name="price"
                                        // unit="$"
                                        // delimiter=","
                                        // separator="."
                                        precision={2}
                                        style={styles.input}
                                        placeholder="Price"
                                        placeholderTextColor="lightgrey"
                                        onChangeText={(text)=>{
                                            handleChangePrice(text)
                                            formikProps.handleChange("price")
                                        }}
                                        // value={formikProps.values.price}
                                        value={`$${price}`}
                                        onBlur={formikProps.handleBlur("price")}
                                    />
                                </View>
                                <Text style={styles.warning}>{errors.price ? "Price must be a number" : ''}</Text>

                                {/* <View style={styles.textInput}>
                                    <Text style={styles.formTitle}>Are you selling a {itemType} or service?</Text>
                                    <TextInput
                                        name="sellType"
                                        style={styles.input}
                                        placeholder="sellType"
                                        placeholderTextColor="lightgrey"
                                        onChangeText={formikProps.handleChange("sellType")}
                                        value={formikProps.values.sellType}
                                        onBlur={formikProps.handleBlur("sellType")}
                                    />
                                </View> */}
                                <Text style={styles.warning}>{errors.sellType ? "Must verify selling type" : ''}</Text>
                                <View style={styles.textInput}>
                                    <Text style={styles.formTitle}>{itemType} Condition</Text>
                                    <TextInput
                                        name="condition"
                                        style={styles.input}
                                        placeholder="Condition"
                                        placeholderTextColor="lightgrey"
                                        onChangeText={formikProps.handleChange("condition")}
                                        value={formikProps.values.condition}
                                        onBlur={formikProps.handleBlur("condition")}
                                    />
                                </View>
                                <Text style={styles.warning}>{errors.title ? "Must varify the condition" : ''}</Text>
                                <View style={styles.textInput}>
                                    <Text style={styles.formTitle}>{itemType} Title</Text>
                                    <TextInput
                                        name="title"
                                        style={styles.input}
                                        placeholder="Title"
                                        placeholderTextColor="lightgrey"
                                        onChangeText={formikProps.handleChange("title")}
                                        value={formikProps.values.title}
                                        onBlur={formikProps.handleBlur("title")}
                                    />
                                </View>
                                <Text style={styles.warning}>{errors.title ? "Must have a title" : ''}</Text>
                                {/* <View style={styles.textInput}>
                                    <Text style={styles.formTitle}>Places you can meet to sell</Text>
                                    <TextInput
                                        name="placesCanMeet"
                                        style={styles.input}
                                        placeholder="Places can meet"
                                        placeholderTextColor="lightgrey"
                                        onChangeText={formikProps.handleChange("placesCanMeet")}
                                        value={formikProps.values.placesCanMeet}
                                        onBlur={formikProps.handleBlur("placesCanMeet")}
                                    />
                                </View> */}
                                <Text style={styles.warning}>{errors.title ? "These feild is required" : ''}</Text>
                                <View style={styles.textInput}>
                                    <Text style={styles.formTitle}>{itemType} Description</Text>
                                    <TextInput
                                        maxHeight={300}
                                        minHeight={100}
                                        name="description"
                                        multiline
                                        style={styles.input}
                                        placeholder="Description"
                                        placeholderTextColor="lightgrey"
                                        onChangeText={formikProps.handleChange("description")}
                                        value={formikProps.values.description}
                                        onBlur={formikProps.handleBlur("description")}
                                    />
                                </View>
                                <Text style={styles.warning}>{errors.title ? "Must have a description" : ''}</Text>
                                <View style={styles.btns}>
                                    <TouchableOpacity onPress={onGoBack}>
                                        <View style={styles.nextStep}>
                                            <Text >Back</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={formikProps.submitForm}>
                                        <View style={styles.nextStep}>
                                            <Text >Next</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }
                }
            </Formik>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    form:{
        width: '100%',
    },
    formik:{
        width: '100%'
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        width: '100%',
        backgroundColor: "white",
    },
    warning:{
        color: 'red',
        fontSize: 15
    },
    textInput:{
        marginTop: 20,
        // backgroundColor:'lightgrey'
    },
    formTitle:{

    },
    btns:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginBottom:20
    },
    nextStep:{
        width: 150,
        height: 40,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: 'lightgreen',
        borderRadius: 10,
        marginRight: 'auto',
        marginLeft: 'auto',
        justifyContent:'center',
        alignItems: 'center',
        marginTop: 50
    }
})
