package com.dawn.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChattingMessage {
    public enum MessageType {
        JOIN, TALK, ENTER
    }

    public ChattingMessage() {}

    public ChattingMessage(MessageType type, String roomId, String sender, String message) {
        this.type = type;
        this.roomId = roomId;
        this.sender = sender;
        this.message = message;
    }

    private MessageType type;
    private String roomId;
    private String sender;
    private String message;
}
