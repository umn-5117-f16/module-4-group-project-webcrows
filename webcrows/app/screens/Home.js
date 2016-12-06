import React, { Component } from 'react';
import {
  DrawerLayoutAndroid,
  Text,
  Image,
  View,
  ListView,
  TouchableOpacity,
  Navigator
} from 'react-native';

import ApiHandler from '../services/ApiHandler'
import ViewContainer from '../components/ViewContainer/ViewContainer'
import StatusBarBackground from '../components/StatusBarBackground/StatusBarBackground'
import FitImage from 'react-native-fit-image';

import {
  Container,
  Content,
  Button,
  List,
  ListItem,
  Thumbnail,
  Icon,
  Header,
  Title,
  InputGroup,
  Input
} from 'native-base'

import styles from '../styles/appStyles'

class Home extends Component {
  constructor(props) {
    super (props)
    // this._navigateToThisEvent = this._navigateToThisEvent.bind(this)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2 })
    this.filteredList = []
    this.state = {
      books: [],
      filterText: ''
    }
    this.onPressButton = this.onPressButton.bind(this);
    this.setfilteredlist = this.setfilteredlist.bind(this);
    this.searching = this.searching.bind(this);
    this.loadmyinterests = this.loadmyinterests.bind(this);
  }

  componentDidMount() {
    let self = this
    fetch('https://module4server.herokuapp.com/explore', {
      method: 'GET'
    })
    .then (function(response) {
      return response.json()
    .then (function(json){
        if (json && json.flag==1 && json.allposts) {
          // self.setState({ crowsDS : self.state.crowsDS.cloneWithRows(json.allposts) })
          self.setState({ books : json.allposts, filterText: '' })
        }
      });
    });
  }

  _navigateToThisEvent(book) {
    console.log(this.props.name)
    this.props.navigator.push({
      rt: "Entity",
      element: book,
      name:this.props.name,
      sceneConfig: Navigator.SceneConfigs.FloatFromRight
    })
  }

  eachBook (book, self) {
    //this.navigateToThisEvent.bind(this)
    console.log('Rendering ', book.title)
    return (<ListItem key={book}>
          <TouchableOpacity onPress={()=>self._navigateToThisEvent(book)}>
            <Thumbnail square size={100} source={{uri: book.imageLinks.thumbnail}} />
          </TouchableOpacity>
            <Text> {book.title}</Text>
            <Text> {book.author} </Text>
            <Text> {`$ `} {book.askingPrice} </Text>
          </ListItem>
      )
  }

  onPressButton() {
    this.refs['DRAWER_REF'].openDrawer();
  }

  scan(){
    console.log('Pressed')
    this.props.navigator.push({
      rt : "ScanCamera"
    })
  }

  myUploads() {
    console.log('Pressed')
    this.props.navigator.push({
      rt : "MyUploads",
      user: this.props.name
    })
  }

  searching(text) {
    this.setState({
        filterText: text,
      });
  }

  setfilteredlist(book){
      if (book.title.toLowerCase().indexOf(this.state.filterText.toLowerCase()) === -1) {
        return;
      }
      else {
        this.filteredList.push(book);
        console.log('filteredList [0] is now ', this.filteredList[0].title)
      }

  }


  loadmyinterests(){
    console.log('loading my interests');
    this.props.navigator.push({
      rt : "MyInterests",
      name: this.props.name,

    })
  }
  render() {
    console.log('Rendering')

    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I am the Drawer!</Text>
        <Button
          onPress={() => {
            this.props.navigator.push({
              rt : "ScanCamera",
              sceneConfig: Navigator.SceneConfigs.FadeAndroid
            })
          }}
          title="Add a new Book"
          color="#841584"
          >
          Upload new book
          </Button>
          <Text></Text>
          <Button rounded style={{alignSelf:'center'} } onPress={() => this.loadmyinterests()} >
            Load my Interests
          </Button>
          <Text></Text>
        <Button onPress={this.myUploads.bind(this)} title="My Uploads" color="#841584">
            My Uploads
        </Button>
      </View>
    );

    this.filteredList = []
    this.state.books.forEach((book) => this.setfilteredlist(book));
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}
        ref={'DRAWER_REF'}>
        <Container>
          <Header searchBar rounded>
              <InputGroup>
                <Button transparent onPress={this.onPressButton}>
                  <Icon name="ios-menu" />
                </Button>
                <Icon name="ios-search" />
                <Input
                  placeholder="Search"
                  onChangeText = {(text) => this.searching(text)}/>
              </InputGroup>
            <Button transparent>
              Search
            </Button>
          </Header>

          <Content>
            <List>

              {this.filteredList.map((item) =>
              this.eachBook(item, this)
            )}
            </List>
          </Content>
        </Container>
      </DrawerLayoutAndroid>
    );
  }
}

module.exports = Home
