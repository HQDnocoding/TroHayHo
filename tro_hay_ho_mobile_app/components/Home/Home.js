import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import PostForRent from "./duc/post/PostForRent";
import PostWant from "./duc/post/PostWant";
import {ImageSlider} from "react-native-image-slider-banner";
import WantPlace from "./duc/explore/WantPlace";


const Home = () => {
    // Data mẫu - sau này có thể fetch từ API
    const posts = [
        {
            id: 1,

        },
        {
            id: 2,

        },
    ];

    return (
        <ScrollView style={styles.container}>
            <ImageSlider
                data={[
                    {img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5a5uCP-n4teeW2SApcIqUrcQApev8ZVCJkA&usqp=CAU'},
                    {img: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg'},
                    {img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg'}
                ]}
                autoPlay={true}
                onItemChanged={(item) => console.log("item", item)}
                closeIconColor="#fff"

            />
            <WantPlace/>

            {posts.map(post => (
                <PostForRent key={post.id}/>
            ))}
            {posts.map(post => (
                <PostWant key={post.id}/>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        margin: 10,
        elevation: 4,
    },
    price: {
        color: '#FFBA00',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    address: {
        color: '#666',
        marginBottom: 5,
    },
});

export default Home;