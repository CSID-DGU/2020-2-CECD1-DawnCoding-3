package com.dawn.config;

import org.slf4j.Logger;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.ChannelInterceptorAdapter;

import java.security.Principal;

public class TopicSubscriptionInterceptor implements ChannelInterceptor {

    private static Logger logger = org.slf4j.LoggerFactory.getLogger(TopicSubscriptionInterceptor.class);


    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(message);
        if (StompCommand.SUBSCRIBE.equals(headerAccessor.getCommand())) {
            System.out.println("hello! " + headerAccessor.getNativeHeader("simpUser").get(0));
        }
        return message;
    }

    private boolean validateSubscription(Principal principal, String topicDestination) {
        if (principal == null) {
            // unauthenticated user
            return false;
        }
        logger.debug("Validate subscription for {} to topic {}", principal.getName(), topicDestination);
        //Additional validation logic coming here
        return true;
    }
}