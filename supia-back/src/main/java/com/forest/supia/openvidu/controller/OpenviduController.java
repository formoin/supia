package com.forest.supia.openvidu.controller;

import com.forest.supia.openvidu.service.OpenviduService;
import io.openvidu.java.client.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/openvidu")
public class OpenviduController {

	@Value("${OPENVIDU_URL}")
	private String OPENVIDU_URL;

	@Value("${OPENVIDU_SECRET}")
	private String OPENVIDU_SECRET;

	private OpenVidu openvidu;


	private final OpenviduService openviduService;


	public OpenviduController(@Value("${OPENVIDU_URL}") String OPENVIDU_URL,
                              @Value("${OPENVIDU_SECRET}") String OPENVIDU_SECRET, OpenviduService openviduService) {

		this.openviduService = openviduService;
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

	}

	/**
	 * @param params The Session properties
	 * @return The Session ID
	 */
	//방 만드는 api
	@PostMapping("/sessions")
	public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
			throws OpenViduJavaClientException, OpenViduHttpException {
		System.out.println("openvidu session call");
		SessionProperties properties = SessionProperties.fromJson(params).build();
		Session session = openvidu.createSession(properties);

//		System.out.println(params.get("memberId"));
		long fromMemberId = Long.valueOf((String) params.get("fromUserId"));
		long toMemberId = Long.valueOf((String) params.get("toUserId"));
		System.out.println("Openvidu Message Send" + "from member id: " + fromMemberId + " to member id: " + toMemberId);
		openviduService.sendNotification(fromMemberId, toMemberId);
		return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
	}

	/**
	 * @param sessionId The Session in which to create the Connection
	 * @param params    The Connection properties
	 * @return The Token associated to the Connection
	 */
	//만들어진 방에 들어가는 api
	@PostMapping("/sessions/{sessionId}/connections")
	public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
			@RequestBody(required = false) Map<String, Object> params)
			throws OpenViduJavaClientException, OpenViduHttpException {
		System.out.println("openvidu connection call");
		Session session = openvidu.getActiveSession(sessionId);
		if (session == null) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
		Connection connection = session.createConnection(properties);
		return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
	}

}
