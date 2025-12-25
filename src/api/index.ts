/**
 * API Module Entry Point
 *
 * Two backend instances:
 * - dotnetApi: .NET backend (employee profile, requests, timesheet)
 * - springApi: Spring Boot backend (auth, activities, bonus)
 */

export { default as dotnetApi } from './dotnet';
export { default as springApi } from './spring';

