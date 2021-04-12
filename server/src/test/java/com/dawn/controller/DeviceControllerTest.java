package com.dawn.controller;

import com.dawn.dto.DeviceCycleDTO;
import com.dawn.service.DeviceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.AutoConfigureJsonTesters;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.transaction.Transactional;
import java.util.List;

import static org.hamcrest.CoreMatchers.*;
import static org.hamcrest.MatcherAssert.assertThat;

@SpringBootTest
@AutoConfigureJsonTesters
@AutoConfigureMockMvc
@Transactional
public class DeviceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DeviceController deviceController;

    @Autowired
    private DeviceService deviceService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(deviceController)
                .addFilter((request, response, chain) -> {
                    response.setCharacterEncoding("UTF-8");
                    chain.doFilter(request, response);
                }, "/*")
                .build();
    }

    @Test
    public void getExcludedDeviceList_는_제외된_사이클이_없을경우_비어있는_리스트를_반환한다() {
        List<DeviceCycleDTO.GetExcludedDeviceCycle> body = deviceController.getExcludedDevices().getBody();
        assertThat(body.size(), is(notNullValue()));
        assertThat(body.size(), is(0));
    }

    @Test
    public void getExcludedDeviceList_는_제외된_사이클_리스트를_반환한다() {

    }


}
