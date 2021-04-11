package com.dawn;

import com.dawn.models.RedisDevice;
import com.dawn.repository.DeviceRedisRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@SpringBootTest
public class RedisIntegrationTest {

    @Autowired
    private DeviceRedisRepository deviceRedisRepository;

    @AfterEach
    public void tearDown() throws Exception {
        deviceRedisRepository.deleteAll();
    }

    @Test
    public void 디바이스_레디스_등록() {
        final long DEVICE_ID = 0;
        final LocalDateTime DATETIME = LocalDateTime.now();
        RedisDevice redisDevice = new RedisDevice();
        redisDevice.setDeviceId(DEVICE_ID);
        redisDevice.setLastTriggeredAt(DATETIME);
        deviceRedisRepository.save(redisDevice);
        Optional<RedisDevice> savedDevice = deviceRedisRepository.findById(DEVICE_ID);

        if (savedDevice.isPresent()) {
            RedisDevice device = savedDevice.get();
            assertThat(device.getDeviceId(), is(DEVICE_ID));
            assertThat(device.getLastTriggeredAt(), is(DATETIME));
        }
    }
}
