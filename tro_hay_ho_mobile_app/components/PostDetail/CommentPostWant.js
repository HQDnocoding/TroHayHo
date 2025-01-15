import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import APIs, { endpoints } from "../../configs/APIs";
import moment from "moment";
import { TextInput } from "react-native-paper";

const comment = {
    "count": 4,
    "next": "http://192.168.1.10:8000/post-wants/2/comments/?page=2&page_size=1",
    "previous": null,
    "results": [
        {
            "id": 1,
            "user": {
                "id": 2,
                "username": "dat",
                "first_name": "Đạt",
                "last_name": "Hứa Quang",
                "avatar": "https://res.cloudinary.com/dmbvjjg5a/image/upload/v1736863424/Adolf-Hitler-1933_xazf05",
                "role": {
                    "id": 3,
                    "created_date": "2025-01-13T12:06:48.006729+07:00",
                    "updated_date": "2025-01-13T12:06:48.006729+07:00",
                    "active": true,
                    "role_name": "nguoi_thue_tro"
                },
                "phone": "0913092445",
                "date_joined": "2025-01-13T12:38:51.877948+07:00"
            },
            "replies": [
                {
                    "id": 11,
                    "user": {
                        "id": 2,
                        "username": "dat",
                        "first_name": "Đạt",
                        "last_name": "Hứa Quang",
                        "avatar": "https://res.cloudinary.com/dmbvjjg5a/image/upload/v1736863424/Adolf-Hitler-1933_xazf05",
                        "role": {
                            "id": 3,
                            "created_date": "2025-01-13T12:06:48.006729+07:00",
                            "updated_date": "2025-01-13T12:06:48.006729+07:00",
                            "active": true,
                            "role_name": "nguoi_thue_tro"
                        },
                        "phone": "0913092445",
                        "date_joined": "2025-01-13T12:38:51.877948+07:00"
                    },
                    "replies": [],
                    "created_date": "2025-01-14T23:04:24.036848+07:00",
                    "updated_date": "2025-01-14T23:04:24.036848+07:00",
                    "active": true,
                    "content": "Đây là bình luận số {i}",
                    "date_at": "2025-01-14T23:04:24.036848+07:00",
                    "post": 2,
                    "replied_comment": 1
                }
            ],
            "created_date": "2025-01-14T21:01:11.519444+07:00",
            "updated_date": "2025-01-14T21:01:11.519444+07:00",
            "active": true,
            "content": "Đây là bình luận số 1",
            "date_at": "2025-01-14T21:01:11.519444+07:00",
            "post": 2,
            "replied_comment": null
        },
        {
            "id": 2,
            "user": {
                "id": 2,
                "username": "dat",
                "first_name": "Đạt",
                "last_name": "Hứa Quang",
                "avatar": "https://res.cloudinary.com/dmbvjjg5a/image/upload/v1736863424/Adolf-Hitler-1933_xazf05",
                "role": {
                    "id": 3,
                    "created_date": "2025-01-13T12:06:48.006729+07:00",
                    "updated_date": "2025-01-13T12:06:48.006729+07:00",
                    "active": true,
                    "role_name": "nguoi_thue_tro"
                },
                "phone": "0913092445",
                "date_joined": "2025-01-13T12:38:51.877948+07:00"
            },
            "replies": [
                {
                    "id": 13,
                    "user": {
                        "id": 2,
                        "username": "dat",
                        "first_name": "Đạt",
                        "last_name": "Hứa Quang",
                        "avatar": "https://res.cloudinary.com/dmbvjjg5a/image/upload/v1736863424/Adolf-Hitler-1933_xazf05",
                        "role": {
                            "id": 3,
                            "created_date": "2025-01-13T12:06:48.006729+07:00",
                            "updated_date": "2025-01-13T12:06:48.006729+07:00",
                            "active": true,
                            "role_name": "nguoi_thue_tro"
                        },
                        "phone": "0913092445",
                        "date_joined": "2025-01-13T12:38:51.877948+07:00"
                    },
                    "replies": [],
                    "created_date": "2025-01-14T23:04:24.036848+07:00",
                    "updated_date": "2025-01-14T23:04:24.036848+07:00",
                    "active": true,
                    "content": "Đây là bình luận số {i}",
                    "date_at": "2025-01-14T23:04:24.036848+07:00",
                    "post": 2,
                    "replied_comment": 1
                }
            ],
            "created_date": "2025-01-14T21:01:11.519444+07:00",
            "updated_date": "2025-01-14T21:01:11.519444+07:00",
            "active": true,
            "content": "Đây là bình luận số 1",
            "date_at": "2025-01-14T21:01:11.519444+07:00",
            "post": 2,
            "replied_comment": null
        }
    ]
}


const CommentScreen = ({ postId = 2 }) => {


    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [expandedComments, setExpandedComments] = useState({});

    const toggleReplies = (commentId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };


    const loadComment = async () => {
        if (page > 0) {
            setLoading(true);

            try {
                let url = `${endpoints['pw-comment'](postId)}?page=${page}&page_size=5`;

                let res = await APIs.get(url);

                if (page > 1) {
                    setComments([...comments, ...res.data.results]);
                } else {
                    setComments(res.data.results);
                }

                if (res.data.next == null) {
                    setPage(0);
                }

            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        loadComment();
    }, []);

    useEffect(() => {

        let timer = setTimeout(() => loadComment(), 500);

        return () => clearTimeout(timer);

    }, [page]);

    const loadMore = () => {
        if (page > 0 && !loading) {
            setPage(page + 1);
        }
    }





    const renderComment = ({ item }) => (
        <View style={styles.commentContainer}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <View style={styles.commentContent}>
                <Text style={styles.username}>{item.user.username}</Text>
                <Text style={styles.content}>{item.content}</Text>
                <View style={styles.commentFooter}>
                    <Text style={styles.time}>{moment(item.updated_date).fromNow()}</Text>
                    <TouchableOpacity onPress={() => toggleReplies(item.id)}>
                        <Text style={styles.replyButton}>
                            {expandedComments[item.id] ? 'Ẩn trả lời' : 'Xem trả lời'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* Replies */}
                {expandedComments[item.id] && (
                    <FlatList
                        data={item.replies}
                        renderItem={renderComment}
                        keyExtractor={(reply) => reply.id.toString()}
                    />
                )}
            </View>
        </View>
    );


    const renderReply = ({ item }) => (
        <View style={styles.replyContainer}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatarSmall} />
            <View style={styles.commentContent}>
                <Text style={styles.username}>{item.user.username}</Text>
                <Text style={styles.content}>{item.content}</Text>
            </View>
        </View>
    );
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Bình luận</Text>
            </View>

            {/* Comment List */}
            <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.commentList}
                style={{maxHeight:300}}
            />

            {/* Input Section */}
            {/* <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Thêm bình luận..."
            value={}
            onChangeText={()=>{}}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              if (commentText.trim()) {
                onSendComment(commentText);
                setCommentText('');
              }
            }}
          >
            <Text style={styles.sendText}>Gửi</Text>
          </TouchableOpacity>
        </View> */}
        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        display:'flex',
        backgroundColor: '#fff',
    },
    header: {
        height: 50,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
    },
    commentList: {
        paddingHorizontal: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
    content: {
        fontSize: 14,
        marginBottom: 5,
    },
    commentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 12,
        color: '#777',
        marginRight: 10,
    },
    replyButton: {
        fontSize: 12,
        color: '#007bff',
    },
    replyContainer: {
        flexDirection: 'row',
        marginLeft: 50,
        marginTop: 5,
    },
    avatarSmall: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
    sendButton: {
        marginLeft: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#007bff',
        borderRadius: 20,
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CommentScreen;