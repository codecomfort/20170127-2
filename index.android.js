import React, {Component} from 'react';
import {AppRegistry, ListView, Text, TextInput, StyleSheet, View} from 'react-native';
import Row from './components/Row';
import SectionHeader from './components/SectionHeader';
import sampleData from './SampleData';

class HelloWorldApp extends Component {
    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
            dataSource: ds.cloneWithRows([])
        };
    }

    formatData(data) { // 必要に応じて cloneWithRows に渡す形式に整形
        // SampleData の recipeTitles をもとに、以下のようなデータを作って返す
        // const dataBlob = {
        //     0 : { "category": "煮" },
        //     "0:0" :  {
        //         "menu_name": "ラタトゥイユ",
        //     },
        //     "0:1" : {
        //         "menu_name": "カポナータ",
        //     },
        //     1 : { "category": "焼" },
        //     "1:0" : {
        //         "menu_name": "焼きパプリカ？",
        //     }
        // }
        // const sectionIds = [ 0, 1 ]
        // const rowIds = [
        //     ["0:0", "0:1"], // sectionId = 0 ( rowIds[0] )
        //     ["1:0" ]   // sectionId = 1 ( rowIds[1] )
        // ]
        // return { dataBlob, sectionIds, rowIds }

        const dataBlob = {};
        const sectionIds = [];
        const rowIds = [];
        const sectionMap = new Map();     // {'煮', 0}, {'焼', 1} のような Map
        let sectionCount = -1;
        let rowCount = 0;

        for (let count = 0; count < data.length; count++) {
            let category = data[count].category;
            if (!sectionMap.has(category)) {
                sectionCount++;
                sectionMap.set(category, sectionCount);
                sectionIds.push(sectionCount);
                dataBlob[sectionCount] = { "category": category };
                rowIds.push([]);
                rowCount = 0;
            }

            const rowId = `${sectionCount}:${rowCount}`;
            rowIds[sectionCount].push(rowId);
            dataBlob[rowId] = { "menu_name": data[count].menu_name };
            rowCount++;
        }

        return { dataBlob, sectionIds, rowIds }
    }

    updateDataSource(text) {
        const found = sampleData.find((item) => item.ingredient === text)

        const getSectionHeaderData = (dataBlob, sectionId) => dataBlob[sectionId];
        const getRowData = (dataBlob, sectionId, rowId) => dataBlob[`${rowId}`];
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            getSectionHeaderData,
            getRowData
        });

        if (found === null || found === undefined || found.recipeTitles.length === 0) {
            this.setState({ dataSource: ds.cloneWithRowsAndSections([]) })
            return;
        }

        const { dataBlob, sectionIds, rowIds } = this.formatData(found.recipeTitles)
        this.setState({ dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIds, rowIds) })
    }

    render() {
        return (
            <View style={ styles.container }>
                <TextInput
                    style={ styles.textInput }
                    placeholder="食材を入力してください"
                    onChangeText={ (input) => this.updateDataSource(input) }
                />
                <ListView
                    dataSource={ this.state.dataSource }
                    renderRow={ (data) => <Row {...data} /> }
                    renderSectionHeader={ (sectionData) => <SectionHeader {...sectionData} /> }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    textInput: {
        height: 80,
        fontSize: 30
    }

})

AppRegistry.registerComponent('sample20170127', () => HelloWorldApp);