import React from 'react'
import { Text, View, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native'

export default function Tags({tags=[], onPressTag}){
    function renderTag({ item, index }){
        const { name } = item
        return (
            <TouchableOpacity style={styles.tag} key={String(item.id)} onPress={()=>onPressTag(name)}>
                <Text style={styles.tagName}>#{item.name}</Text>
            </TouchableOpacity>
        )
    }
    if (!tags.length) return null
    return (
        <View style={styles.tags}>
            <FlatList
                ListHeaderComponent={<Text style={styles.tagTitle}>Tags:</Text>}
                renderItem={renderTag}
                data={tags}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    tags: {
        marginTop: 20,
        // height: 50,
        width: '100%',
        flexDirection:'row',
    },
    tagTitle:{
        marginRight: 10,
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 10,
    },
    tag:{
        height: 30,
        width: 100,
        justifyContent: 'center',
        backgroundColor:'lightgreen',
        alignItems: 'center',
        paddingLeft: '2.5%',
        paddingRight: 10,
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10
    },
})
