package com.dawn.service;

import com.dawn.models.*;
import com.dawn.repository.DeviceCycleRepository;
import com.dawn.repository.DeviceRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final RedisTemplate<String, Object> redisTemplate;

    public static final String EVENT_SEQ_LIST = "EVENT_SEQ_LIST";

    public static final String LAST_INDEX = "LAST_INDEX";

    private final DeviceRepository deviceRepository;

    private final DeviceCycleRepository deviceCycleRepository;

    Map<String, Integer> signalEventIndexMap = new HashMap<>();

    Map<String, String> signalEventSequenceMap = new HashMap<>();

    Map<Long, String> sequenceMem = new HashMap<>();

    Map<Long, List<Event>> sequenceMap = new HashMap<>();

    Map<String, Long> lastTriggeredMem = new HashMap<>();


    public RedisDeviceEvent[] eventArray;

    public ArrayList<RedisDeviceEvent> eventList = new ArrayList<>();

    /*
        1. 현재 저장되어 있는 이벤트를 최종 읽기 위치에서부터 가져온다
        2. 마지막 위치 + 1 부터 읽는다
        3. 읽다가 Cycle 이 발견되는 경우, 저장된 시퀀스의 마지막 트리거 타임을 조회한다
        4. 트리거 타임이 쓰레시 홀드 인터벌보다 길 경우 TTS를 출력한다
        5.
     */
    @Scheduled(fixedRate = 500)
    public int ttsExecutor() {
        signalEventIndexMap = new HashMap<>();
        signalEventSequenceMap = new HashMap<>();
        String lastIndexString = (String)redisTemplate.opsForValue().get(LAST_INDEX);
        int lastIndex;
        if (lastIndexString == null || lastIndexString.equals("")) {
            lastIndex = 0;
        } else {
            lastIndex = Integer.parseInt(lastIndexString);
        }
        System.out.println("lastIndex = " + lastIndex);
        List<Object> list = redisTemplate.opsForList().range(EVENT_SEQ_LIST, 0, -1);
        if (list == null) list = new ArrayList<>();
        List<RedisDeviceEvent> eventList = new ArrayList<>();
        list.forEach(x -> eventList.add((RedisDeviceEvent)x));
        eventArray = new RedisDeviceEvent[eventList.size()];
        eventList.toArray(eventArray);
        eventList.forEach(x -> {
            String newEventKey =
                    String.valueOf(x.getDeviceId()) +
                                    '-' +
                                    x.getStatus();


        });
        return list.size();
    }

    @AllArgsConstructor
    class Event {
        private int index;
        private int status;
    }


    public boolean applyEvent(RedisDeviceEvent event, int index) {
        //signalEventIndexMap.put(event.getDeviceId(), index);
        String signalEventKey = event.getDeviceId() + "-" + event.getStatus();
        int lastIndex = signalEventIndexMap.getOrDefault(signalEventKey, -1);
        List<Event> savedSequence = sequenceMap.computeIfAbsent(event.getDeviceId(), k -> new ArrayList<>());
        Event currEvent = new Event(index, event.getStatus());
        //redisTemplate.opsForList().rightPush(EVENT_SEQ_LIST, event);
        eventList.add(event);
        if (lastIndex == -1) {
            signalEventIndexMap.put(signalEventKey, index);
            savedSequence.add(currEvent);
            sequenceMap.put(event.getDeviceId(), savedSequence);
            return false;
        }

        final StringBuilder createdSequenceBuilder = new StringBuilder();

        for (int i=0; i < savedSequence.size(); i++) {
            Event e = savedSequence.get(i);
            signalEventIndexMap.put(event.getDeviceId() + "-" + e.status, -1);
            createdSequenceBuilder.append(e.status);
        }
        signalEventIndexMap.put(event.getDeviceId() + "-" + event.getStatus(), index);

        String createdSequence = createdSequenceBuilder.toString();
        // 마지막 이벤트 기준의 시간측정
        long lastTriggeredTimeOfSequence = lastTriggeredMem.computeIfAbsent(createdSequence, (k) -> (long) -1);
        DeviceCycle existingDeviceCycle = deviceCycleRepository.getDeviceCycleBySequence(createdSequence);
        if (existingDeviceCycle == null) {
            Device currDevice  = deviceRepository.findById(event.getDeviceId()).get();
            deviceCycleRepository.save(new DeviceCycle(currDevice, createdSequence));
        } else {
            if (event.getTriggeredAt() - lastTriggeredTimeOfSequence <= existingDeviceCycle.getThreshold()) {
                sequenceMap.put(event.getDeviceId(), null);
                existingDeviceCycle.setExcludedAcc(existingDeviceCycle.getExcludedAcc() + 1);
                //savedSequence.forEach(e -> eventArray[e.index] = null);
                savedSequence.forEach(e -> eventList.set(e.index, null));
            }
        }

        lastTriggeredMem.put(createdSequence, event.getTriggeredAt());
        List<Event> splicedList = new ArrayList<>();
        splicedList.add(currEvent);
        sequenceMap.put(event.getDeviceId(), splicedList);
        return true;
    }
}