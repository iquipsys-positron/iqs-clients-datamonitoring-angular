export enum SensorParameterAlgorithm {
    Custom = 'custom', // Whatever user decides
    Count = 'count', // Increments counter
    Statistics = 'statistics', // Calculate min/max/average
    Duration = 'duration', // Calculate duration in on (1) state
    Transport = 'transport', // Calculate transported amount
    Consumption = 'consumption', // Calculate consumption volume
    Pressure = 'presure', // Pressure
}
