import React, { useState, useEffect } from 'react'
import {View, Text, TextInput, Image, Dimensions, TouchableOpacity, StyleSheet} from 'react-native'
import Fontisto from "react-native-vector-icons/Fontisto";
import Entypo from "react-native-vector-icons/Entypo";

const deviceWidth = Dimensions.get('window').width
import { onChangeSearch, changeSearchType } from '../../store/reducers/search'
import { useDispatch, useSelector } from 'react-redux'

export function ProductsHeader({ onSearch }){
    const [viewSettings, setViewSettings] = useState(false)
    const dispatch = useDispatch()
    const { search, searchType } = useSelector(mapState)

    useEffect(()=>{},[searchType])

    function onChangeText(text){
        dispatch(onChangeSearch(text))
    }

    function onChangeSearchType(){
        const type = searchType === 'Tags' ? 'Title' : 'Tags'
        dispatch(changeSearchType(type))
    }

    function onClear(){
        dispatch(onChangeSearch(''))
    }
    return (
        <View style={{ width: deviceWidth, marginTop: 10, height: 50}}>
            {/* <Text style={HeaderStyles.products}>Products</Text> */}
            <View style={HeaderStyles.bottom}>
                <View style={HeaderStyles.iconSearch}>
                    <Fontisto style={HeaderStyles.icon} name="search"/>
                    <TextInput
                        value={search}
                        onChangeText={onChangeText}
                        placeholder={searchType === 'Tags' ?"Search Product Tags..." : 'Search Product Titles'}
                        onSubmitEditing={()=>onSearch(search)}
                        style={HeaderStyles.search}
                    />
                    { !!search && (
                        <TouchableOpacity onPress={onClear}>
                            <Fontisto
                                name="close-a"
                                style={HeaderStyles.close}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={HeaderStyles.options} onPress={onChangeSearchType}>
                    <Text>{searchType}</Text>
                        <Entypo name="chevron-down" style={HeaderStyles.downArrow}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

function mapState(state){
    return {
        search: state.Search.search,
        searchType: state.Search.searchType
    }
}

export const HeaderStyles = StyleSheet.create({
    Header: {
        height: 130,
    },
    products:{
        fontSize: 16,
        fontWeight:'600'
    },
    iconSearch:{
        flexDirection:'row',
        borderWidth: 1,
        padding: 10,
        flex: 1,
        alignItems: 'center',
        marginLeft: 10
    },
    icon:{
        fontSize: 16,
        marginRight: 10
    },
    search:{
        height: 20,
        flex: 1
    },
    close:{
        // marginRight: 10
    },
    bottom:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    options:{
        height: '100%',
        width: '25%',
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        flexDirection:'row',
        paddingLeft: 5,
        paddingRight: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    downArrow:{
        fontSize: 16
    }
})
