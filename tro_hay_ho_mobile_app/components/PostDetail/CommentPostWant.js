import { useEffect, useState } from "react";
import {  Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import APIs, { endpoints } from "../../configs/APIs";
import moment from "moment";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { FlatList } from "react-native";




const CommentScreen = ({ postId = 2 }) => {


    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [expandedComments, setExpandedComments] = useState({});
    const [commentText, setCommentText] = useState()

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
                let url = `${endpoints['pw-comment'](postId)}?page=${page}&page_size=4`;

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
            {/* Avatar */}
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <View style={styles.commentContent}>
                {/* Tên người dùng và nội dung bình luận */}
                <Text>
                    <Text style={styles.username}>{item.user.username} </Text>
                    <Text style={styles.content}>{item.content}</Text>
                </Text>
                {/* Thời gian và nút trả lời */}
                <View style={styles.commentFooter}>
                    <Text style={styles.time}>{moment(item.updated_date).fromNow()}</Text>
                    <TouchableOpacity onPress={() => toggleReplies(item.id)}>
                        <Text style={styles.replyButton}>
                            {expandedComments[item.id] ? 'Ẩn trả lời' : 'Xem trả lời'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* Hiển thị trả lời con */}
                {expandedComments[item.id] && (
                    <FlatList
                    scrollEnabled={false}
                        data={item.replies}
                        renderItem={renderComment}
                        keyExtractor={(reply) => reply.id.toString()}
                        nestedScrollEnabled={true}
                        contentContainerStyle={{ marginLeft: 40 }}
                    />
                )}
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
                                scrollEnabled={false}

                nestedScrollEnabled={true}
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.commentList}
                showsVerticalScrollIndicator={false} // Ẩn thanh cuộn
                onEndReached={loadMore} // Tải thêm khi cuộn đến cuối
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && <ActivityIndicator />} // Hiển thị khi đang tải
            />

            {/* Input Section */}
            <KeyboardAvoidingView style={styles.inputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >


                <TextInput
                    mode="flat"
                    style={styles.input}
                    placeholder="Thêm bình luận..."
                    placeholderTextColor="#888"
                    value={commentText}
                    onChangeText={setCommentText}
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() => {
                        // if (commentText.trim()) {
                        //     onSendComment(commentText);
                        //     setCommentText('');
                        // }
                    }}
                >
                    <Text style={styles.sendText}>Gửi</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    header: {
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 15,
        fontWeight: 500,

    },
    commentList: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginRight: 10,
    },
    commentContent: {
        flex: 1,
    },
    username: {
        fontWeight: '600',
        fontSize: 14,
        color: '#000',
    },
    content: {
        fontSize: 14,
        color: '#333',
    },
    commentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
    },
    time: {
        fontSize: 12,
        color: '#888',
        marginRight: 15,
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
        borderBottomStartRadius: 30,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        borderBottomEndRadius: 30,
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