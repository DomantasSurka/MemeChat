import React from 'react';
import { ChannelList } from './ChannelList';
import './chat.scss';
import { MessagesPanel } from './MessagesPanel';
const WebSocket = require('ws')
import socketClient from "socket.io-client";
const SERVER = "wss://testchatserver.fourace.repl.co";
export class Chat extends React.Component {

    state = {
        channels: null,
        socket: null,
        channel: null
    }
    socket;
    componentDidMount() {
        this.loadChannels();
        this.configureSocket();
    }

    configureSocket = () => {
        var socket = new WebSocket(SERVER);
        socket.on('connection', () => {
            console.log('a');
            if (this.state.channel) {
                this.handleChannelSelect(this.state.channel.id);
            }
        });
        socket.on('channel', channel => {
            
            let channels = this.state.channels;
            channels.forEach(c => {
                if (c.id === channel.id) {
                    c.participants = channel.participants;
                }
            });
            this.setState({ channels });
        });
        socket.on('message', message => {
            
            let channels = this.state.channels
            channels.forEach(c => {
                if (c.id === message.channel_id) {
                    if (!c.messages) {
                        c.messages = [message];
                    } else {
                        c.messages.push(message);
                    }
                }
            });
            this.setState({ channels });
        });
        this.socket = socket;
    }

    loadChannels = async () => {
        fetch('https://testchatserver.fourace.repl.co:81/getChannels').then(async response => {
            let data = await response.json();
            this.setState({ channels: data.channels });
        })
    }

    handleChannelSelect = id => {
        let channel = this.state.channels.find(c => {
            return c.id === id;
        });
        this.setState({ channel });
        this.socket.emit('channel-join', id, ack => {
        });
    }

    handleSendMessage = (channel_id, text) => {
        this.socket.emit('send-message', { channel_id, text, senderName: this.socket.id, id: Date.now() });
    }

    render() {

        return (
            <div className='chat-app'>
                <ChannelList channels={this.state.channels} onSelectChannel={this.handleChannelSelect} />
                <MessagesPanel onSendMessage={this.handleSendMessage} channel={this.state.channel} />
            </div>
        );
    }
}