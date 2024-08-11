export class HealthCheckService {
    getStatus() {
        const date = new Date();
        return {
            status: "OK",
            date: date.toISOString(),
        };
    }
}
