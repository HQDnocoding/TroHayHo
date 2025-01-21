import { useContext, useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import APIs, { authAPIs, endpoints } from "../../configs/APIs";
import moment from "moment";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { FlatList } from "react-native";
import { MyUserContext } from "../../configs/UserContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CommentScreen = ({ postId, routName }) => {
    const user = useContext(MyUserContext);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [expandedComments, setExpandedComments] = useState({});
    const [commentText, setCommentText] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null);

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
                let url = `${endpoints[routName](postId)}?page=${page}&page_size=3`;
                let res = await APIs.get(url);
                if (page > 1) {
                    setComments([...comments, ...res.data.results]); // Ghép thêm bình luận mới
                } else {
                    setComments(res.data.results); // Tải lần đầu
                }
                if (res.data.next == null) {
                    setPage(0); // Không còn trang tiếp theo
                } else {
                    setPage((prevPage) => prevPage + 1); // Tăng page lên mỗi khi tải thêm
                }
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };
    


    useEffect(() => {
        if (page > 0) {
            loadComment();
        }
    }, []);

    // useEffect(() => {
    //     let timer = setTimeout(() => loadComment(), 500);
    //     return () => clearTimeout(timer);
    // }, [page]);

    const loadMoreButton = () => {
        if (page > 0 && !loading) {
            return (
                <TouchableOpacity onPress={loadComment} style={styles.loadMoreButton}>
                    <Text style={styles.loadMoreText}>Tải thêm</Text>
                </TouchableOpacity>
            );
        }
        return null;
    };

    const addReply = (comments, replyToCommentId, reply) => {
        return comments.map(comment => {
            // Nếu bình luận này là bình luận cha của reply
            if (comment.id === replyToCommentId) {
                // Thêm trả lời mới vào mảng replies của bình luận này
                return { ...comment, replies: [...(comment.replies || []), reply] };
            }
    
            // Nếu bình luận này có replies, tiếp tục kiểm tra đệ quy
            if (comment.replies) {
                return { ...comment, replies: addReply(comment.replies, replyToCommentId, reply) };
            }
    
            // Nếu không có replies hoặc không phải bình luận cần thêm trả lời, giữ nguyên bình luận
            return comment;
        });
    };
    const onSendComment = async () => {
        if (commentText?.trim()) {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem("token");
                const res = await authAPIs(token).post(endpoints[routName](postId), {
                    content: commentText,
                    replied_comment: replyToCommentId, // Trả lời comment cha nếu có
                });
                if (replyToCommentId) {
                    setComments((prevComments) => addReply(prevComments, replyToCommentId, res.data));
                } else {
                    setComments([res.data, ...comments]);
                }
                setCommentText('');
                setReplyToCommentId(null); // Reset trạng thái trả lời
            } catch (ex) {
                console.error("Lỗi khi gửi bình luận:", ex);
            } finally {
                setLoading(false);
            }
        }
    };

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
                    <TouchableOpacity onPress={() => setReplyToCommentId(item.id)}>
                        <Text style={styles.replyButton}>Trả lời</Text>
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
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.commentList}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    loading ? <ActivityIndicator /> : loadMoreButton() // Hiển thị ActivityIndicator hoặc nút "Tải thêm"
                }
            />

            {/* Input Section */}
            {user !== null && (
                <KeyboardAvoidingView style={styles.inputContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    {/* Hiển thị trạng thái trả lời */}
                    {replyToCommentId && (
                        <View style={styles.replyingToContainer}>
                            <Text style={styles.replyingToText}>
                                {comments.find(c => c.id === replyToCommentId)?.user.username}
                            </Text>
                            <TouchableOpacity onPress={() => setReplyToCommentId(null)}>
                                <Text style={styles.cancelReplyText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TextInput
                        mode="flat"
                        style={styles.input}
                        placeholder="Thêm bình luận..."
                        placeholderTextColor="#888"
                        value={commentText}
                        onChangeText={setCommentText}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, commentText.trim() === '' || loading ? { backgroundColor: '#ccc' } : null]}
                        onPress={onSendComment}
                        disabled={commentText.trim() === '' || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.sendText}>Gửi</Text>
                        )}
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    header: {
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 15,
        fontWeight: '500',
    },
    commentList: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    commentContainer: {
        flexDirection: 'row',
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    replyingToContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 5,
    },
    replyingToText: {
        fontSize: 14,
        color: '#333',
        marginRight: 10,
    },
    cancelReplyText: {
        fontSize: 14,
        color: '#007bff',
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
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#007bff',
        alignItems: 'center',
    },
    sendText: {
        color: '#fff',
        fontWeight: '600',
    },
    loadMoreButton: {
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        marginVertical: 20,
    },
    loadMoreText: {
        fontSize: 16,
        color: '#007bff',
        fontWeight: '600',
    },
});
export default CommentScreen;
