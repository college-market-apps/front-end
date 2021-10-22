import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Modal from '../../components/Modal'

function RadioButton({selected, name, onPress, style}){
    return (
        <TouchableOpacity style={[s.radioOption,style]} onPress={onPress}>
            <MaterialIcons name={selected() ? 'radio-button-checked' :'radio-button-off'} style={s.radioIcon}/>
            <Text style={s.name}>{name}</Text>
        </TouchableOpacity>
    )
}

export default function ShoppingCartSettings({visible, onClose, onChangeFilter, onChangeSort, isSelected}){
    return (
        <Modal visible={visible} onClose={onClose} modalStyle={s.modalStyle} innerViewStyle={s.innerViewStyle}>
            <View style={s.container}>
                <Text style={s.filterBy}>Filter By:</Text>
                <View style={s.filterOptions}>
                    <RadioButton selected={()=>isSelected('all','filterBy')} name="All Products" style={s.filterOptionsLeft} onPress={()=>onChangeFilter("all")} />
                    <RadioButton  name="Sold Products" selected={()=>isSelected('sold','filterBy')} onPress={()=>onChangeFilter("sold")}/>
                    <RadioButton  name="Penning Products" selected={()=>isSelected('pennding','filterBy')} onPress={()=>onChangeFilter("pennding")}/>
                </View>
                <Text style={s.filterBy}>Sort By:</Text>
                <View style={s.filterByOptions}>
                    <View style={s.orderLeft}>
                        <RadioButton name="Created Date" selected={()=>isSelected('createdAt','sortBy')} onPress={()=>onChangeSort("createdAt")} />
                        <RadioButton name="Product Title" selected={()=>isSelected('title','sortBy')} onPress={()=>onChangeSort("title")}/>
                        <RadioButton name="Product Description" selected={()=>isSelected('description','sortBy')} onPress={()=>onChangeSort("description")}/>
                    </View>
                    <View>
                        <RadioButton name="Users" selected={()=>isSelected('users','sortBy')} onPress={()=>onChangeSort("users")} />
                        <RadioButton  name="Price" selected={()=>isSelected('price','sortBy')} onPress={()=>onChangeSort("price")}/>
                        <RadioButton name="Sold" selected={()=>isSelected('sold','sortBy')} onPress={()=>onChangeSort("sold")}/>
                        {/* <RadioButton selected={true} name="test good"/> */}
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const s = StyleSheet.create({
    modalStyle:{
        height: "100%",
        width: '100%'
    },
    innerViewStyle:{
        height: 400,
        width: '100%',
        backgroundColor:'white'
    },
    container:{
        padding: 10,
        width: '100%',
        height: "100%"
    },
    filterOptions:{
        flexDirection:'row',
        flexWrap:'wrap',
        marginTop: 10,
        marginBottom: 10
    },
    filterOptionsLeft:{
        width: '50%'
    },
    filterBy:{
        fontSize: 25,
        fontWeight: '600'
    },
    filterByOptions:{
        flexDirection:'row',
        alignItems: 'flex-start',
    },
    radioOption:{
        flexDirection:'row',
        alignItems:'center',
        marginTop: 5
    },
    name:{
        marginLeft: 5,
        fontSize: 18
    },
    radioIcon:{
        fontSize: 16
    },
    orderLeft:{
        width:'50%'
    }
})
