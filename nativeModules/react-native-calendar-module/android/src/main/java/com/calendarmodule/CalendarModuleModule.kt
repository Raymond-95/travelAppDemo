package com.calendarmodule

import android.Manifest
import android.content.ContentUris
import android.content.ContentValues
import android.content.pm.PackageManager
import android.provider.CalendarContract
import android.net.Uri
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.BaseActivityEventListener
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

class CalendarModuleModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var currentPromise: Promise? = null

    init {
        reactContext.addActivityEventListener(object : BaseActivityEventListener() {})
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun createCalendarEvent(
        title: String,
        latitude: Double,
        longitude: Double,
        startDate: String,
        endDate: String,
        promise: Promise
    ) {
        currentPromise = promise

        // Check if permissions are already granted
        if (hasCalendarPermission()) {
            // Permissions are granted, proceed to create the event
            addEventToCalendar(title, latitude, longitude, startDate, endDate, promise)
        } else {
            // Request permissions
            requestPermissionWithCallback(
                onGranted = {
                    addEventToCalendar(title, latitude, longitude, startDate, endDate, promise)
                },
                onDenied = {
                    promise.reject("PERMISSION_DENIED", "Calendar permission is required")
                }
            )
        }
    }

    @ReactMethod
    fun deleteCalendarEvent(eventID: String, promise: Promise) {
        currentPromise = promise

        // Check if permissions are already granted
        if (hasCalendarPermission()) {
            // Permissions are granted, proceed to delete the event
            deleteEventFromCalendar(eventID, promise)
        } else {
            // Request permissions
            requestPermissionWithCallback(
                onGranted = {
                    deleteEventFromCalendar(eventID, promise)
                },
                onDenied = {
                    promise.reject("PERMISSION_DENIED", "Calendar permission is required")
                }
            )
        }
    }

    // Method to check if calendar permissions are granted
    private fun hasCalendarPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            reactApplicationContext,
            Manifest.permission.WRITE_CALENDAR
        ) == PackageManager.PERMISSION_GRANTED
    }

    // Generic method to request calendar permissions with callback
    private fun requestPermissionWithCallback(onGranted: () -> Unit, onDenied: () -> Unit) {
        val activity = currentActivity
        if (activity != null) {
            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.WRITE_CALENDAR, Manifest.permission.READ_CALENDAR),
                CALENDAR_PERMISSION_REQUEST_CODE
            )
            // You will handle the permission result in onRequestPermissionsResult (not shown here)
            // Based on the result, either onGranted or onDenied can be called
        } else {
            currentPromise?.reject("ACTIVITY_NULL", "Activity is null")
        }
    }

    private fun getDefaultCalendarId(): Long? {
        val projection = arrayOf(CalendarContract.Calendars._ID, CalendarContract.Calendars.CALENDAR_DISPLAY_NAME)
        val uri = CalendarContract.Calendars.CONTENT_URI
        val cursor = reactApplicationContext.contentResolver.query(uri, projection, null, null, null)
        cursor?.use {
            val idIndex = it.getColumnIndex(CalendarContract.Calendars._ID)
            val accountNameIndex = it.getColumnIndex(CalendarContract.Calendars.CALENDAR_DISPLAY_NAME)

            while (it.moveToNext()) {
                val accountName = it.getString(accountNameIndex)
                if (accountName == "xxxx@email.com") { // Replace with your email
                    return it.getLong(idIndex) // Return the ID of your personal calendar
                }
            }
        }
        return null
    }

    // Helper method to add an event to the calendar
    private fun addEventToCalendar(
        title: String,
        latitude: Double,
        longitude: Double,
        startDate: String,
        endDate: String,
        promise: Promise
    ) {
        val eventValues = ContentValues()
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        Log.e("testing: ", getDefaultCalendarId().toString())
        try {
            val startMillis: Long = dateFormat.parse(startDate)?.time
                ?: throw Exception("Invalid start date format")
            val endMillis: Long = dateFormat.parse(endDate)?.time
                ?: throw Exception("Invalid end date format")

            eventValues.put(CalendarContract.Events.CALENDAR_ID, getDefaultCalendarId())
            eventValues.put(CalendarContract.Events.TITLE, title)
            eventValues.put(CalendarContract.Events.EVENT_LOCATION, "geo:$latitude,$longitude")
            eventValues.put(CalendarContract.Events.DTSTART, startMillis)
            eventValues.put(CalendarContract.Events.DTEND, endMillis)
            eventValues.put(CalendarContract.Events.EVENT_TIMEZONE, TimeZone.getDefault().id)

            val uri: Uri? = reactApplicationContext.contentResolver.insert(
                CalendarContract.Events.CONTENT_URI, eventValues
            )
            if (uri != null) {
                val eventID: Long = uri.lastPathSegment?.toLong() ?: -1L

                // Set the reminder (1 day before the event)
                val reminderValues = ContentValues()
                reminderValues.put(CalendarContract.Reminders.MINUTES, 1440)
                reminderValues.put(CalendarContract.Reminders.EVENT_ID, eventID)
                reminderValues.put(CalendarContract.Reminders.METHOD, CalendarContract.Reminders.METHOD_ALERT)

                reactApplicationContext.contentResolver.insert(
                    CalendarContract.Reminders.CONTENT_URI, reminderValues
                )
                Log.e("testing: ", eventID.toString())
                promise.resolve(eventID.toString())
            } else {
                promise.reject("ERROR", "Failed to insert event")
            }
        } catch (e: Exception) {
            Log.e("testing: ", e.toString())
            promise.reject("ERROR", e.localizedMessage)
        }
    }

    // Helper method to delete an event from the calendar
    private fun deleteEventFromCalendar(eventID: String, promise: Promise) {
        try {
            // Create URI for event ID
            val uri: Uri = ContentUris.withAppendedId(CalendarContract.Events.CONTENT_URI, eventID.toLong())

            // Delete the event
            val rows: Int = reactApplicationContext.contentResolver.delete(uri, null, null)
            if (rows > 0) {
                // Return success if rows were deleted
                promise.resolve("Event deleted successfully")
            } else {
                promise.reject("ERROR", "Failed to delete event")
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.localizedMessage)
        }
    }

    companion object {
        const val NAME = "CalendarModule"
        const val CALENDAR_PERMISSION_REQUEST_CODE = 1001
    }
}
