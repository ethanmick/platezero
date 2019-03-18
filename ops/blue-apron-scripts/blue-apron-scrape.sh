#!/bin/bash

PAGE=$1

curl "https://www.blueapron.com/api/subscriptions/3905692/orders/past?per_page=50&page=$PAGE" -H 'cookie: isMobileWeb=false; recipe_newsletter_modal_seen=true; _ue=47a3eef714e684af93421a3f673dac9ae972d7b7; _ue256=54dd370cf725ad0ea3d802aaa25491deacc4085df0442005f9c90def20381fc1; holdback_groups=%7B%7D; __stripe_mid=aeb06f58-343c-4550-8c23-9eb8d92a2bc5; show_3ds_tip=true; _session_id=00d7b71219101d73119a0a57b95d0a08; user_attributes=%7B%22first_name%22%3A%22Ethan%22%2C%22available_invites%22%3A5%2C%22is_active%22%3Atrue%2C%22is_canceled%22%3Afalse%2C%22id%22%3A3970432%2C%22is_family%22%3Afalse%2C%22is_wine_active%22%3Afalse%2C%22is_wine_canceled%22%3Afalse%2C%22is_wine_only%22%3Afalse%2C%22payment_method%22%3Anull%2C%22order_quantity%22%3A1%2C%22facility_id%22%3A38%2C%22is_pmc%22%3Atrue%2C%22is_a_la_carte%22%3Afalse%2C%22a_la_carte_reactivation_eligible%22%3Afalse%2C%22track_full_story%22%3Afalse%2C%22food_sub_type%22%3A%22recurring%22%2C%22should_view_pmc_modal%22%3Atrue%2C%22is_referrals_view%22%3Afalse%7D; site_tests=11365122109&family_five_and_plan_flexing_holdbacks&account_zendesk_chat_testing&reactivation_copy&expiring_credits_modal&miss_upcoming_order&10866910433&11719184225&activationButtonExperiment&upcomingToggleLayoutExperiment&8353667113&14039640465&preference_collection_test&googleAutofillSignupExperiment&8608270290&12043245466&eds-to-new-users&android_reportIssue&streamlinedOnboardingExperiment&guestLaunchTabExperiment&pushNotificationsPermissionExperiment&10757424344&11050061240&memberPushNotificationPermissionCopyExperiment&trial-default-meal-quantity&android_enhanced_meal_picker&rollout_registration_refresh&welcome_series_test&10703533526&10953366100&a_la_carte_reactivation&10758531911&10799253137&10882590260&android_invitePrompt&10927990810&10904231317&cutoff_reminders_test&email_password&android_inviteContacts&one-pot-meal-badge-test&android_merchandising&late-cutoff-test&3ds_test&invite_grant_push_notifications&reactivation_v2&registration-refresh&checkout_refresh&android_upcoming_3ds&user_login_landing_location_2&11208244654; market_cart=0; wineUpsellNextRoute=restrictions; __zlcmid=rIi5HMqGnzYO42; __stripe_sid=c278c0d9-12b5-4eb5-8e8a-cbd5160698f4' -H 'x-newrelic-id: UwQCV1RWGwcFU1BbAQg=' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-US,en;q=0.9' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36' -H 'accept: application/json, text/javascript, */*; q=0.01' -H 'referer: https://www.blueapron.com/account' -H 'authority: www.blueapron.com' -H 'x-requested-with: XMLHttpRequest' --compressed | jq '.orders[] | .recipes[] | .slug' >> slugs.txt