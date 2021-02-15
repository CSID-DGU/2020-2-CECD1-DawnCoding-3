package com.dawn.controller;

import com.dawn.dto.DeviceDTO;
import com.dawn.repository.STTRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;

@Transactional
@RestController
@RequiredArgsConstructor
public class STTController {
    private static final ClassPathResource sttPath = new ClassPathResource("static/tmpcommand.py");
    private final STTRepository sttRepository;

    @GetMapping("/stt")
    public ResponseEntity<Object> doSTT() throws Exception {
        final String realPath = sttPath.getURL().getPath().substring(1);
        Runtime rt = Runtime.getRuntime();
        Process pc = null;
        List<DeviceDTO.STTResult> result = null;
        try {
            System.out.println("python " + realPath);

            // 실제 STT 이후 처리하는 시간
            Thread.sleep(2000);

            pc = rt.exec("python " + realPath);
            BufferedReader br = new BufferedReader(new InputStreamReader(pc.getInputStream()));
            String line = null;
            String query = null;
            while((line = br.readLine()) != null){
                System.out.println("query result : " + line);
                query = line;
            }
            result = sttRepository.getSTTResult(query);
        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("STT 예외가 발생했습니다.");
        } finally {
            pc.waitFor();
            pc.destroy();
        }
        return new ResponseEntity(result, HttpStatus.OK);
    }
}
