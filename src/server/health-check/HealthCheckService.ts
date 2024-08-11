export class HealthCheckService {
	public getStatus() {
		const date = new Date();
		return {
			status: "OK",
			date: date.toISOString(),
		};
	}
}
